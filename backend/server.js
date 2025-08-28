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
    choix_num,
    centre_choisi,
    periode_debut,
    periode_fin,
    demande_type,
    statut
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO forms (
        matricule, choix_num, centre_choisi, periode_debut, periode_fin, 
        demande_type, statut, cree_le, modifie_le
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *`,
      [
        matricule || null,
        choix_num || null,
        centre_choisi || null,
        periode_debut || null,
        periode_fin || null,
        demande_type || null,
        statut || 'En attente'
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
        f.choix_num,
        f.centre_choisi,
        TO_CHAR(f.periode_debut, 'DD/MM/YYYY') AS periode_debut,
        TO_CHAR(f.periode_fin, 'DD/MM/YYYY') AS periode_fin,
        f.demande_type,
        f.statut,
        f.note,
        f.cree_le,
        TO_CHAR(f.cree_le, 'DD/MM/YYYY') AS cree_le_formatted,
        TO_CHAR(f.modifie_le, 'DD/MM/YYYY') AS modifie_le
      FROM forms f
      LEFT JOIN users u ON f.matricule = u.matricule
      ORDER BY f.cree_le DESC, f.choix_num;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des demandes:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// DELETE /api/demandes/:id
app.delete('/api/demandes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM forms WHERE id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Demande non trouvée" });
    res.status(200).json({ message: "Demande supprimée" });
  } catch (err) {
    console.error('Erreur suppression:', err);
    res.status(500).json({ error: 'Erreur serveur' });
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
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post('/api/forms/reset', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear().toString();

    // 1. Reset statut to 'En attente' and note to 0 for forms currently 'valide' or 'en traitement'
    await pool.query(`
      UPDATE forms
      SET statut = 'En attente', note = 0
      WHERE statut IN ('valide', 'en traitement')
    `);

    // 2. Delete benefit_history entries for these forms' matricules in current year
    // First, get matricules of forms that were reset
    const { rows: matriculesRows } = await pool.query(`
      SELECT DISTINCT matricule
      FROM forms
      WHERE statut = 'En attente'
    `);

    const matricules = matriculesRows.map(row => row.matricule);

    if (matricules.length > 0) {
      // Delete benefit_history for these matricules and current year
      await pool.query(
        `DELETE FROM benefit_history WHERE matricule = ANY($1) AND benefit_year = $2`,
        [matricules, currentYear]
      );
    }

    res.json({ message: 'Tous les formulaires ont été remis en "En attente" et l\'historique a été supprimé.' });
  } catch (error) {
    console.error('Erreur dans /forms/reset:', error);
    res.status(500).json({ error: 'Erreur lors de la remise à zéro.' });
  }
});



app.post('/api/forms/process', async (req, res) => {
  try {
    // 1️⃣ Get all forms with statut 'en traitement'
    const { rows: forms } = await pool.query(
      "SELECT * FROM forms WHERE statut = 'en traitement'"
    );

    const MAX_KIDS = 8;
    const BASE_MARRIED_SCORE = 10;
    const MAX_RAW_SCORE = BASE_MARRIED_SCORE + MAX_KIDS;

    const currentYear = new Date().getFullYear().toString();

    let processedForms = [];

    // 2️⃣ Calculate note for everyone
    for (const form of forms) {
      const { rows: userData } = await pool.query(
        "SELECT * FROM users WHERE matricule = $1",
        [form.matricule]
      );
      const user = userData[0];

      const { rows: historyData } = await pool.query(
        "SELECT benefit_year FROM benefit_history WHERE matricule = $1",
        [form.matricule]
      );
      const years = historyData.map(h => h.benefit_year);

      let rawScore = 0;
      let benefitMultiplier = 1;

      const had2023 = years.includes("2023");
      const had2024 = years.includes("2024");

      if (had2023 && had2024) {
        benefitMultiplier = 0.17;
      } else if (had2023 && !had2024) {
        benefitMultiplier = 0.5;
      } else if (!had2023 && had2024) {
        benefitMultiplier = 0.25;
      } else {
        benefitMultiplier = 1;
      }

      if (user.situation_familiale === "Marié(e)") {
        const kids = parseInt(user.nombre_enfants_beneficiaires || 0);
        rawScore = kids > 0 ? BASE_MARRIED_SCORE + kids : 0;
      } else {
        rawScore = 0;
      }

      const note = Math.min(
        100,
        Math.round((rawScore / MAX_RAW_SCORE) * 100 * benefitMultiplier)
      );

      processedForms.push({
        form,
        user,
        note
      });
    }

    // 3️⃣ Group forms by (centre_choisi, periode_debut)
    const groups = {};
    for (const pf of processedForms) {
      const centre = pf.form.centre_choisi || "unknown_centre";
      const startDate = pf.form.periode_debut;
      const key = `${centre}_${startDate}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(pf);
    }

    // 4️⃣ Decide winners in each group
    for (const key in groups) {
      const group = groups[key];

      group.sort((a, b) => {
        if (b.note !== a.note) return b.note - a.note;
        return new Date(a.user.date_affectation_au_bureau) - new Date(b.user.date_affectation_au_bureau);
      });

      for (let i = 0; i < group.length; i++) {
        const { form, user, note } = group[i];

        // Month of periode_debut
        const monthNum = new Date(form.periode_debut).getMonth();

        // Célibataire summer exclusion
        const isSummerCeli =
          user.situation_familiale.toLowerCase() === "célibataire" &&
          [5, 6, 7].includes(monthNum);

        let newStatut = "en traitement";
        if (!isSummerCeli && i === 0) {
          newStatut = "valide";
        }

        // Update forms
        await pool.query(
          "UPDATE forms SET statut = $1, note = $2 WHERE id = $3",
          [newStatut, note, form.id]
        );

        // Update benefit_history only if valide
        if (newStatut === "valide") {
          const { rows: existing } = await pool.query(
            "SELECT id FROM benefit_history WHERE matricule = $1 AND benefit_year = $2",
            [form.matricule, currentYear]
          );

          if (existing.length > 0) {
            await pool.query(
              "UPDATE benefit_history SET note = $1, created_at = NOW() WHERE id = $2",
              [note, existing[0].id]
            );
          } else {
            await pool.query(
              "INSERT INTO benefit_history (matricule, benefit_year, note, created_at) VALUES ($1, $2, $3, NOW())",
              [form.matricule, currentYear, note]
            );
          }
        }
      }
    }

    res.json({ message: "Traitement terminé avec succès." });
  } catch (err) {
    console.error("Erreur dans /process:", err);
    res.status(500).json({ error: "Erreur lors du traitement final." });
  }
});





app.get('/api/forms/historique', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.matricule,
        u.nom_complet,
        u.situation_familiale,
        u.nombre_enfants_beneficiaires,
        u.date_affectation_au_bureau,
        u.role,
        f.statut,
        f.note,
        COALESCE(
          (
            SELECT json_agg(j ORDER BY (j->>'year')::int DESC)
            FROM (
              SELECT DISTINCT jsonb_build_object('year', bh2.benefit_year) AS j
              FROM benefit_history bh2
              WHERE bh2.matricule = f.matricule AND bh2.benefit_year IS NOT NULL
            ) sub
          ),
          '[]'
        ) AS benefit_years
      FROM forms f
      LEFT JOIN users u ON f.matricule = u.matricule
      WHERE f.statut IN ('valide', 'en traitement')
      GROUP BY f.matricule, u.nom_complet, u.situation_familiale, 
               u.nombre_enfants_beneficiaires, u.date_affectation_au_bureau, 
               u.role, f.statut, f.note
      ORDER BY u.nom_complet
    `);

    const merged = result.rows.map(row => {
      const user = {
        matricule: row.matricule,
        nom_complet: row.nom_complet,
        situation_familiale: row.situation_familiale,
        nombre_enfants_beneficiaires: row.nombre_enfants_beneficiaires,
        date_affectation_au_bureau: row.date_affectation_au_bureau,
        role: row.role,
        statut: row.statut,
        note: row.note ?? 0
      };

      row.benefit_years.forEach(entry => {
        if (entry.year) {
          const suffix = `A${String(entry.year).slice(-2)}`;
          user[suffix] = '✔️';
        }
      });

      return user;
    });

    res.json(merged);
  } catch (error) {
    console.error('Erreur dans /api/forms/historique:', error);
    res.status(500).json({ error: 'Erreur serveur lors de récupération historique' });
  }
});


app.get('/api/beneficiaires', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.matricule,
        u.nom_complet,
        f.centre_choisi,
        f.periode_debut,
        f.periode_fin
      FROM forms f
      JOIN users u ON f.matricule = u.matricule
      JOIN benefit_history bh ON bh.matricule = f.matricule AND bh.benefit_year = EXTRACT(YEAR FROM NOW())::int
      WHERE f.statut = 'valide'
      ORDER BY u.nom_complet
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur dans /api/beneficiaires :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_database() AS db, current_user AS user');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});























app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
