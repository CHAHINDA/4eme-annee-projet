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





app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
