import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/marsa-port.jpg'

export default function DemandeCentreVacances() {
  const location = useLocation()
  const navigate = useNavigate()
  const { type, month } = location.state || {}
  const [showMessage, setShowMessage] = useState(false)


  const demandeType = type === 'campagne' && month ? month : 'Normal'
  const documentCode = ['E', 'N', 'D', 'C', 'V', 'G', 'E', 'G', 'R', 'H', 'S', '1', '1']

  // State to toggle visibility of 2nd and 3rd choices
  const [showSecondChoice, setShowSecondChoice] = useState(false)
  const [showThirdChoice, setShowThirdChoice] = useState(false)

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
`}</style>


      <div className="return-wrapper">
        <button className="return-btn" onClick={() => navigate('/home')}>
          ← Retour à l'accueil
        </button>
      </div>

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

          {/* Box 1 */}
          <div className="form-box">
            <div className="form-title">Informations sur le (la) bénéficiaire :</div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nom">Nom et Prénom</label>
                <input id="nom" type="text" />
              </div>
              <div className="form-group">
                <label htmlFor="numSerie">Matricule</label>
                <input id="numSerie" type="text" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="direction">Direction</label>
                <input id="direction" type="text" />
              </div>
              <div className="form-group">
                <label htmlFor="dateAffectation">Date d’affectation au bureau</label>
                <input id="dateAffectation" type="date" />
              </div>
            </div>

            <div className="form-row">
              
              <div className="radio-group">
                <label className="radio-item">
                  <input type="radio" name="position" value="execution" />
                  Exécution
                </label>
                <label className="radio-item">
                  <input type="radio" name="position" value="encadrement" />
                  Encadrement
                </label>
                <label className="radio-item">
                  <input type="radio" name="position" value="cadres" />
                  Cadres
                </label>
                <label className="radio-item">
                  <input type="radio" name="position" value="cadresSup" />
                  Cadres Supérieurs
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="situationFamiliale">Situation familiale</label>
                <input id="situationFamiliale" type="text" />
              </div>
              <div className="form-group">
                <label htmlFor="nombreEnfants">Nombre d’enfants bénéficiaires</label>
                <input id="nombreEnfants" type="text" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: '1 1 100%' }}>
                <label htmlFor="telephone">Téléphone</label>
                <input id="telephone" type="text" />
              </div>
            </div>
          </div>

            {/* Box 2 with modified table */}
          <div className="form-box">
            <div className="form-title">Choix du centre de vacances</div>

            <table>
              <thead>
                <tr>
                  <th>Choix du centre de vacances</th>
                  <th>
                    Premier choix (obligatoire)
                    {!showSecondChoice && (
                      <span
                        className="add-choice-btn"
                        title="Ajouter deuxième choix"
                        onClick={() => setShowSecondChoice(true)}
                      >
                        +
                      </span>
                    )}
                  </th>
                  {showSecondChoice && (
                    <th>
                      Deuxième choix (facultatif)
                      {!showThirdChoice && (
                        <span
                          className="add-choice-btn"
                          title="Ajouter troisième choix"
                          onClick={() => setShowThirdChoice(true)}
                        >
                          +
                        </span>
                      )}
                    </th>
                  )}
                  {showThirdChoice && <th>Troisième choix (facultatif)</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Centre demandé</td>
                  <td>
                    <input
                      className="table-input"
                      type="text"
                      required
                      placeholder="Obligatoire"
                      name="premierChoix"
                    />
                  </td>
                  {showSecondChoice && (
                    <td>
                      <input className="table-input" type="text" name="deuxiemeChoix" />
                    </td>
                  )}
                  {showThirdChoice && (
                    <td>
                      <input className="table-input" type="text" name="troisiemeChoix" />
                    </td>
                  )}
                </tr>
                <tr>
                  <td>Période demandée (date de sortie non incluse)</td>
                  <td>
                    <div className="date-range">
                      <input type="date" name="periodePremierDebut" />
                      <span>au</span>
                      <input type="date" name="periodePremierFin" />
                    </div>
                  </td>
                  {showSecondChoice && (
                    <td>
                      <div className="date-range">
                        <input type="date" name="periodeDeuxiemeDebut" />
                        <span>au</span>
                        <input type="date" name="periodeDeuxiemeFin" />
                      </div>
                    </td>
                  )}
                  {showThirdChoice && (
                    <td>
                      <div className="date-range">
                        <input type="date" name="periodeTroisiemeDebut" />
                        <span>au</span>
                        <input type="date" name="periodeTroisiemeFin" />
                      </div>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
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
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
  <button
    onClick={() => navigate('/home')}
    style={{
      backgroundColor: '#007acc',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
    }}
  >
    Enregistrer
  </button>
</div>

      </div>
    </>
  )
}