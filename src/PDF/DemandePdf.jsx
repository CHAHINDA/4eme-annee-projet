import React from 'react'
import logo from '../assets/marsa-port.jpg'

export default function DemandePdf({ formData, demandeType, documentCode, showSecondChoice, showThirdChoice }) {
  return (
    <>
     <style>{`
  .return-wrapper {
    display: flex;
    justify-content: flex-start;
    padding: 20px 30px 0;
  }
  .return-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #007acc;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  .return-btn:hover {
    background: #005fa3;
  }
  .header-container {
    display: flex;
    align-items: flex-start;
    border: 2px solid #007acc;
    border-radius: 12px;
    padding: 16px 24px;
    max-width: 1100px;
    margin: 20px auto;
    gap: 24px;
    background: white;
    box-shadow: 0 2px 8px rgb(0 122 204 / 0.2);
  }
  .logo-container {
    flex-shrink: 0;
  }
  .logo-container img {
    height: 160px;
    width: auto;
    object-fit: contain;
  }
  .content-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .title-row {
    font-weight: 700;
    font-size: 2.2rem;
    color: #005fa3;
    margin-bottom: 6px;
  }
  .underline {
    border-bottom: 2px solid #007acc;
    margin-bottom: 25px;
  }
  .document-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #007acc;
    user-select: none;
    flex-wrap: wrap;
  }
  .document-label {
    white-space: nowrap;
    margin-right: 8px;
    font-size: 2rem;
  }
  .document-box {
    border: 1.5px solid #007acc;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 1rem;
    background: #e6f0ff;
    user-select: text;
  }

  .form-container {
    margin: 0 auto 40px;
    font-family: Arial, sans-serif;
    color: #222;
    max-width: 1200px;
    padding: 0 20px;
  }

  .form-long-cadre {
    border: 2px solid #007acc;
    border-radius: 12px;
    padding: 24px;
    background: #fdfdfd;
    box-shadow: 0 2px 8px rgba(0, 122, 204, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .form-box {
    border: 2px solid #007acc;
    border-radius: 12px;
    background: white;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(0, 122, 204, 0.05);
    overflow-x: auto; /* enable horizontal scroll for table */
  }

  .form-title {
    font-weight: 700;
    font-size: 1.15rem;
    color: #005fa3;
    margin-bottom: 20px;
    border-bottom: 2px solid #007acc;
    padding-bottom: 6px;
  }

  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
  }
  .form-group {
    flex: 1 1 300px;
    display: flex;
    flex-direction: column;
  }
  label {
    font-weight: 600;
    margin-bottom: 6px;
  }
  input[type="text"],
  input[type="date"],
  select {
    padding: 8px 10px;
    font-size: 1rem;
    border: 1.5px solid #007acc;
    border-radius: 6px;
    outline: none;
  }
  input[type="radio"] {
    accent-color: #007acc;
    cursor: pointer;
  }

  .radio-group {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: 8px;
  }
  .radio-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Table styling */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 1rem;
    min-width: 700px;
  }
  thead tr {
    background-color: #007acc;
    color: white;
  }
  th, td {
    border: 1.5px solid #007acc;
    padding: 8px 12px;
    text-align: center;
    vertical-align: middle;
  }
  th:first-child, td:first-child {
    text-align: left;
  }
  input.table-input {
    width: 90%;
    padding: 6px 8px;
    border: 1.5px solid #007acc;
    border-radius: 6px;
  }
  .date-range {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  .date-range input {
    width: 100px;
  }

  /* Responsive improvements */
  @media (max-width: 720px) {
    .form-row {
      flex-direction: column;
    }
    .form-group {
      flex: 1 1 100%;
    }

    /* Make table horizontally scrollable on small screens */
    table {
      min-width: 600px;
    }

    /* Keep header visible */
    thead tr {
      font-size: 0.9rem;
    }

    /* Keep th/td nowrap to prevent wrapping */
    th, td {
      white-space: nowrap;
    }

    /* Adjust input width inside table */
    input.table-input {
      width: 90%;
    }
  }

  /* "+" button always visible and styled */
  .add-choice-btn {
    cursor: pointer;
    font-weight: bold;
    font-size: 1.2rem;
    color: #007acc;
    user-select: none;
    margin-left: 6px;
    vertical-align: middle;
    border: 1.5px solid #007acc;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    display: inline-block;
    background-color: white;
    visibility: visible !important;
    opacity: 1 !important;
    transition: background-color 0.3s ease;
  }
  .add-choice-btn:hover {
    background-color: #e6f0ff;
  }
    @media print {
  .no-print {
    display: none !important;
  }
}

`}</style>
<div className="header-container">
        <div className="logo-container">
          <img src={logo} alt="Logo MARSAMAROC" />
        </div>
        <div className="content-container">
          <div className="title-row">
            DEMANDE ({demandeType}) DE CENTRE DE VACANCES
          </div>
          <div className="underline" />
          <div className="document-row">
            <span className="document-label">Document :</span>
            {documentCode.map((char, i) => (
              <span key={i} className="document-box">{char}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="form-container">
        <div className="form-long-cadre">

          {/* Box 1: Readonly info */}
          <div className="form-box">
            <div className="form-title">Informations sur le (la) bénéficiaire :</div>

            <div className="form-row">
              <div className="form-group">
                <label>Nom et Prénom</label>
                <div>{formData.nom || '—'}</div>
              </div>
              <div className="form-group">
                <label>Matricule</label>
                <div>{formData.numSerie || '—'}</div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Direction</label>
                <div>{formData.direction || '—'}</div>
              </div>
              <div className="form-group">
                <label>Date d’affectation au bureau</label>
                <div>{formData.dateAffectation || '—'}</div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Position</label>
                <div>{formData.position || '—'}</div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Situation familiale</label>
                <div>{formData.situationFamiliale || '—'}</div>
              </div>
              <div className="form-group">
                <label>Nombre d’enfants bénéficiaires</label>
                <div>{formData.nombreEnfants || '—'}</div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: '1 1 100%' }}>
                <label>Téléphone</label>
                <div>{formData.telephone || '—'}</div>
              </div>
            </div>
          </div>

          {/* Box 2: Choix du centre de vacances (table) */}
          <div className="form-box">
            <div className="form-title">Choix du centre de vacances</div>

            <table>
              <thead>
                <tr>
                  <th>Choix du centre de vacances</th>
                  <th>Premier choix (obligatoire)</th>
                  {showSecondChoice && <th>Deuxième choix (facultatif)</th>}
                  {showThirdChoice && <th>Troisième choix (facultatif)</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Centre demandé</td>
                  <td>{formData.premierChoix || '—'}</td>
                  {showSecondChoice && <td>{formData.deuxiemeChoix || '—'}</td>}
                  {showThirdChoice && <td>{formData.troisiemeChoix || '—'}</td>}
                </tr>
                <tr>
                  <td>Période demandée (date de sortie non incluse)</td>
                  <td>
                    {formData.periodePremierDebut || '—'} au {formData.periodePremierFin || '—'}
                  </td>
                  {showSecondChoice && (
                    <td>
                      {formData.periodeDeuxiemeDebut || '—'} au {formData.periodeDeuxiemeFin || '—'}
                    </td>
                  )}
                  {showThirdChoice && (
                    <td>
                      {formData.periodeTroisiemeDebut || '—'} au {formData.periodeTroisiemeFin || '—'}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Box 3: Engagement (static text) */}
          <div className="form-box">
            <div className="form-title">Engagement du bénéficiaire</div>
            <p style={{ marginBottom: '1em', whiteSpace: 'pre-line', lineHeight: '1.7' }}>
              Je soussigné(e), m’engage à :{'\n'}
              ✔ Respecter le règlement intérieur du centre, visant à garantir le confort des vacanciers, la sécurité des infrastructures et des équipements, et précisant les conditions d’utilisation des installations communes ;{'\n'}
              ✔ Respecter les règles d’hygiène et de propreté, et veiller à la bonne utilisation des équipements du centre ;{'\n'}
              ✔ Ne pas dépasser le nombre de personnes autorisées par logement ;{'\n'}
              ✔ Présenter, si nécessaire, les pièces d’identité des accompagnants ;{'\n'}
              ✔ Payer toute indemnité en cas de dommage ou dégradation des équipements du centre ;{'\n'}
              ✔ Me présenter au centre de vacances entre 14h00 et 21h00 ;{'\n'}
              ✔ Libérer le logement avant 12h00 (midi).
            </p>

            <p style={{ marginBottom: '1em' }}>
              <strong>Signature du bénéficiaire :</strong><br />
              {`Fait le : ${new Date().toLocaleDateString('fr-FR')}`}
            </p>

            <p style={{ fontWeight: 'bold', color: '#aa0000', lineHeight: '1.6' }}>
              Remarque importante :<br />
              L’accès au centre n’est autorisé qu’aux accompagnants mentionnés ci-dessus et disposant d’un pass vaccinal valide.<br />
              La demande doit être déposée au minimum trois jours avant la date d’entrée au centre.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

