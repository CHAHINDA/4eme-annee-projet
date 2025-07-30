const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./db"); // PostgreSQL pool

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ POST: Add new period
app.post("/api/periods", async (req, res) => {
  const { name, startDate, endDate } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO periods (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *",
      [name || null, startDate || null, endDate || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: All periods
app.get("/api/periods", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM periods ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE: A period by ID
app.delete("/api/periods/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query("DELETE FROM periods WHERE id = $1", [id]);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: All users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT  nom_complet, matricule, email, telephone, situation_familiale,
       nombre_enfants_beneficiaires, role, date_affectation_au_bureau
      FROM users
      ORDER BY nom_complet
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des utilisateurs" });
  }
});

// ✅ POST: Add new user
app.post("/api/users", async (req, res) => {
  const {
    nom_complet,
    matricule,
    date_affectation_au_bureau,
    role,
    situation_familiale,
    nombre_enfants_beneficiaires,
    telephone,
    email,
    password
  } = req.body;

  // Rename password field to match DB column mot_de_passe
  const mot_de_passe = password;

  try {
    const result = await pool.query(
      `INSERT INTO users (
        nom_complet, matricule, date_affectation_au_bureau, role,
        situation_familiale, nombre_enfants_beneficiaires,
        telephone, email, mot_de_passe
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        nom_complet || null,
        matricule || null,
        date_affectation_au_bureau || null,
        role || null,
        situation_familiale || null,
        nombre_enfants_beneficiaires || null,
        telephone || null,
        email || null,
        mot_de_passe || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de l'insertion :", err);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur" });
  }
});
// ✅ DELETE: A user by ID
app.delete("/api/users/:matricule", async (req, res) => {
  const matricule = req.params.matricule;  // no parseInt since likely string
  try {
    const result = await pool.query("DELETE FROM users WHERE matricule = $1", [matricule]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur serveur lors de la suppression de l'utilisateur" });
  }
});
// ✅ PUT: Update user by matricule
app.put("/api/users/:matricule", async (req, res) => {
  try {
    const { matricule } = req.params;
    let {
      nom_complet = null,
      date_affectation_au_bureau = null,
      role = null,
      situation_familiale = null,
      nombre_enfants_beneficiaires = null,
      telephone = null,
      email = null,
      password = null,
    } = req.body;

    // Convert empty string to null explicitly:
    if (date_affectation_au_bureau === "") {
      date_affectation_au_bureau = null;
    }

    const mot_de_passe = password;

    const result = await pool.query(
      `
      UPDATE users SET
        nom_complet = $1,
        date_affectation_au_bureau = $2,
        role = $3,
        situation_familiale = $4,
        nombre_enfants_beneficiaires = $5,
        telephone = $6,
        email = $7,
        mot_de_passe = $8
      WHERE matricule = $9
      RETURNING *
      `,
      [
        nom_complet,
        date_affectation_au_bureau,
        role,
        situation_familiale,
        nombre_enfants_beneficiaires,
        telephone,
        email,
        mot_de_passe,
        matricule,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ message: "Utilisateur modifié avec succès", user: result.rows[0] });
  } catch (error) {
    console.error("❌ Erreur lors de la modification de l'utilisateur:", error);
    res.status(500).json({ error: "Erreur serveur lors de la modification de l'utilisateur" });
  }
});


// GET: single user by matricule
app.get("/api/users/:matricule", async (req, res) => {
  const matricule = req.params.matricule;
  try {
    const result = await pool.query(
      `SELECT nom_complet, matricule, email, telephone, situation_familiale,
      nombre_enfants_beneficiaires, role, date_affectation_au_bureau
      FROM users WHERE matricule = $1`,
      [matricule]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération de l'utilisateur" });
  }
});


// POST /api/login — verify nom_complet and mot_de_passe
app.post("/api/login", async (req, res) => {
  const { nom_complet, mot_de_passe } = req.body;

  if (!nom_complet || !mot_de_passe) {
    return res.status(400).json({ error: "Nom complet et mot de passe requis" });
  }

  try {
    const result = await pool.query(
      "SELECT matricule, nom_complet FROM users WHERE nom_complet = $1 AND mot_de_passe = $2",
      [nom_complet, mot_de_passe]
    );

    if (result.rows.length > 0) {
      // Return immediately after sending response
      return res.json({
        success: true,
        nom_complet: result.rows[0].nom_complet,
        matricule: result.rows[0].matricule
      });
    } else {
      return res.status(401).json({ success: false, message: "Nom ou mot de passe invalide" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
});

// POST: Add new form (DemandeCentreVacances)
app.post("/api/forms", async (req, res) => {
  const {
    matricule,
    premier_choix,
    deuxieme_choix,
    troisieme_choix,
    periode_premier_debut,
    periode_premier_fin,
    periode_deuxieme_debut,
    periode_deuxieme_fin,
    periode_troisieme_debut,
    periode_troisieme_fin,
    demande_type,
    statut,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO forms (
        matricule,
        premier_choix,
        deuxieme_choix,
        troisieme_choix,
        periode_premier_debut,
        periode_premier_fin,
        periode_deuxieme_debut,
        periode_deuxieme_fin,
        periode_troisieme_debut,
        periode_troisieme_fin,
        demande_type,
        statut,
        cree_le,
        modifie_le
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
      ) RETURNING *`,
      [
        matricule || null,
        premier_choix || null,
        deuxieme_choix || null,
        troisieme_choix || null,
        periode_premier_debut || null,
        periode_premier_fin || null,
        periode_deuxieme_debut || null,
        periode_deuxieme_fin || null,
        periode_troisieme_debut || null,
        periode_troisieme_fin || null,
        demande_type || null,
        statut || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de l'insertion du formulaire :", err);
    res.status(500).json({ error: "Erreur serveur lors de l'ajout du formulaire" });
  }
});

app.get('/api/demandes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        f.id,
        f.matricule,
        u.nom_complet,
        u.date_affectation_au_bureau,
        u.nombre_enfants_beneficiaires AS nes,
        u.situation_familiale,
        f.premier_choix,
        f.deuxieme_choix,
        f.troisieme_choix,
        CONCAT(
          TO_CHAR(f.periode_premier_debut, 'DD/MM/YYYY'), ' au ', TO_CHAR(f.periode_premier_fin, 'DD/MM/YYYY')
        ) AS periode1,
        CONCAT(
          TO_CHAR(f.periode_deuxieme_debut, 'DD/MM/YYYY'), ' au ', TO_CHAR(f.periode_deuxieme_fin, 'DD/MM/YYYY')
        ) AS periode2,
        CONCAT(
          TO_CHAR(f.periode_troisieme_debut, 'DD/MM/YYYY'), ' au ', TO_CHAR(f.periode_troisieme_fin, 'DD/MM/YYYY')
        ) AS periode3,
        f.demande_type,
        f.statut,
        TO_CHAR(f.cree_le, 'DD/MM/YYYY') AS cree_le,
        TO_CHAR(f.modifie_le, 'DD/MM/YYYY') AS modifie_le
      FROM forms f
      JOIN users u ON f.matricule = u.matricule
      ORDER BY u.nom_complet
    `);

    res.json(result.rows); // ✅ Send JSON to frontend
  } catch (err) {
    console.error("Erreur lors de la récupération des demandes:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// DELETE /api/demandes/:id
app.delete('/api/demandes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM forms WHERE id = $1', [id]); // or whatever your table is
    res.status(204).send();
  } catch (err) {
    console.error('Erreur suppression:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});


app.get("/api/admin", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT nom_complet, matricule, email, telephone, situation_familiale,
      nombre_enfants_beneficiaires, role, date_affectation_au_bureau,mot_de_passe
      FROM users WHERE nom_complet = 'admin'`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'admin:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.put("/api/admin", async (req, res) => {
  let {
    email = null,
    telephone = null,
    situation_familiale = null,
    nombre_enfants_beneficiaires = null,
    role = null,
    date_affectation_au_bureau = null,
    mot_de_passe = null,
  } = req.body;

  try {
    let query;
    let params;

    if (mot_de_passe && mot_de_passe.trim() !== '') {
      // Update including password
      query = `
        UPDATE users SET
          email = $1,
          telephone = $2,
          situation_familiale = $3,
          nombre_enfants_beneficiaires = $4,
          role = $5,
          date_affectation_au_bureau = $6,
          mot_de_passe = $7
        WHERE nom_complet = 'admin'
        RETURNING *
      `;
      params = [
        email,
        telephone,
        situation_familiale,
        nombre_enfants_beneficiaires,
        role,
        date_affectation_au_bureau,
        mot_de_passe,
      ];
    } else {
      // Update without password
      query = `
        UPDATE users SET
          email = $1,
          telephone = $2,
          situation_familiale = $3,
          nombre_enfants_beneficiaires = $4,
          role = $5,
          date_affectation_au_bureau = $6
        WHERE nom_complet = 'admin'
        RETURNING *
      `;
      params = [
        email,
        telephone,
        situation_familiale,
        nombre_enfants_beneficiaires,
        role,
        date_affectation_au_bureau,
      ];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin non trouvé" });
    }

    res.status(200).json({ message: "Admin modifié avec succès", admin: result.rows[0] });
  } catch (err) {
    console.error("Erreur modification admin:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post('/api/forms/prepare', async (req, res) => {
  try {
    await pool.query("UPDATE forms SET statut = 'en traitement' WHERE statut = 'En attente'");
    res.json({ message: "Demandes passées en traitement." });
  } catch (err) {
    console.error("Erreur dans /prepare:", err);
    res.status(500).json({ error: "Erreur lors du passage en traitement." });
  }
});

app.post('/api/forms/process', async (req, res) => {
  try {
    // Get forms currently in 'en traitement'
    const { rows: forms } = await pool.query("SELECT * FROM forms WHERE statut = 'en traitement'");

    const scores = [];

    for (const form of forms) {
      // Get user info
      const { rows: userData } = await pool.query(
        'SELECT * FROM users WHERE matricule = $1',
        [form.matricule]
      );
      const user = userData[0];

      // Get benefit history for 2023 and 2024
      const { rows: history } = await pool.query(
        "SELECT benefit_year FROM benefit_history WHERE matricule = $1",
        [form.matricule]
      );
      const years = history.map(h => h.benefit_year);

      let note = 0;

      if (user.situation_familiale === 'Célibataire') {
        note = 0; // instantly excluded
      } else if (user.situation_familiale === 'Marié(e)') {
        note = parseInt(user.nombre_enfants_beneficiaires || 0);

        const had2023 = years.includes('2023');
        const had2024 = years.includes('2024');

        if (had2023 && had2024) {
          note += 0;
        } else if (had2023 && !had2024) {
          note += 1;
        } else if (!had2023 && had2024) {
          note += 2;
        } else {
          note += 3;
        }
      }

      scores.push({ id: form.id, matricule: form.matricule, note });
    }

    // Select top 5 winners (score > 0)
    const topWinners = scores
      .filter(f => f.note > 0)
      .sort((a, b) => b.note - a.note)
      .slice(0, 5);

    const winnerIds = topWinners.map(f => f.id);

    // Update winners statut = 'valide'
    if (winnerIds.length > 0) {
      await pool.query(
        "UPDATE forms SET statut = 'valide' WHERE id = ANY($1::int[])",
        [winnerIds]
      );
    }

    // Update other forms still 'en traitement'
    await pool.query(
      "UPDATE forms SET statut = 'en traitement' WHERE statut = 'en traitement' AND id != ALL($1::int[])",
      [winnerIds]
    );

    // Insert or update benefit_history for winners with their note and current year
    const currentYear = new Date().getFullYear().toString();

    for (const winner of topWinners) {
      // Check if benefit_history record exists for matricule and year
      const { rows: existing } = await pool.query(
        "SELECT id FROM benefit_history WHERE matricule = $1 AND benefit_year = $2",
        [winner.matricule, currentYear]
      );

      if (existing.length > 0) {
        // Update existing note
        await pool.query(
          "UPDATE benefit_history SET note = $1, created_at = NOW() WHERE id = $2",
          [winner.note, existing[0].id]
        );
      } else {
        // Insert new record
        await pool.query(
          "INSERT INTO benefit_history (matricule, benefit_year, note, created_at) VALUES ($1, $2, $3, NOW())",
          [winner.matricule, currentYear, winner.note]
        );
      }
    }

    res.json({ message: "Traitement terminé avec succès." });
  } catch (err) {
    console.error("Erreur dans /process:", err);
    res.status(500).json({ error: "Erreur lors du traitement final." });
  }
});











app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
