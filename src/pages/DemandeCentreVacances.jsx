import { useState, useRef } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import logo from '../assets/marsa-port.jpg'
import html2canvas from 'html2canvas'

export default function DemandeCentreVacances() {
  const location = useLocation()
  const navigate = useNavigate()
  const { type, campaign } = location.state || {}  // <-- changed here

  const [saved, setSaved] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    numSerie: '',
    direction: '',
    dateAffectation: '',
    position: '',
    situationFamiliale: '',
    nombreEnfants: '',
    telephone: '',
    premierChoix: '',
    deuxiemeChoix: '',
    troisiemeChoix: '',
    periodePremierDebut: '',
    periodePremierFin: '',
    periodeDeuxiemeDebut: '',
    periodeDeuxiemeFin: '',
    periodeTroisiemeDebut: '',
    periodeTroisiemeFin: '',
  })

  // Use campaign.name if campaign exists, else 'Normal'
  const demandeType = type === 'campagne' && campaign ? campaign.name : 'Normal'

  const documentCode = ['E', 'N', 'D', 'C', 'V', 'G', 'E', 'G', 'R', 'H', 'S', '1', '1']
  const [showSecondChoice, setShowSecondChoice] = useState(false)
  const [showThirdChoice, setShowThirdChoice] = useState(false)

  const formRef = useRef(null)

const handleChange = (e) => {
  const { name, value, type: inputType } = e.target
  if (inputType === 'radio') {
    setFormData((prev) => ({ ...prev, position: value }))
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name.includes('Debut') || name.includes('Fin')) {
      validateDate(value)
    }
  }
}


  const handleEnregistrer = () => {
    setSaved(true)
    alert('Form saved (frontend only)')
  }

  const cloneAndPrepareForPdf = () => {
    const original = formRef.current
    if (!original) return null

    const clone = original.cloneNode(true)
    clone.style.position = 'fixed'
    clone.style.top = '-9999px'
    clone.style.left = '0'
    clone.style.width = '300mm'
    clone.style.minHeight = '297mm'
    clone.style.padding = '0.5cm 0cm 5cm 0cm'

    document.body.appendChild(clone)
    return clone
  }

  const handleImprimer = async () => {
    setIsPrinting(true);

    const hiddenContainer = cloneAndPrepareForPdf();
    if (!hiddenContainer) {
      setIsPrinting(false);
      return;
    }

    const elementsToHide = document.querySelectorAll('.no-print');
    elementsToHide.forEach(el => (el.style.display = 'none'));

    const hiddenElements = document.querySelectorAll('.only-pdf, .only-print');
    hiddenElements.forEach(el => el.classList.add('show-for-pdf'));

    try {
      const canvas = await html2canvas(hiddenContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const pxToMm = (px) => px * 0.264583;
      const imgWidthMM = pxToMm(canvas.width);
      const imgHeightMM = pxToMm(canvas.height);
      const imgRatio = imgWidthMM / imgHeightMM;

      let finalWidth = pageWidth;
      let finalHeight = finalWidth / imgRatio;

      if (finalHeight > pageHeight) {
        finalHeight = pageHeight;
        finalWidth = finalHeight * imgRatio;
      }

      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      pdf.save('demande.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      elementsToHide.forEach(el => (el.style.display = ''));
      hiddenElements.forEach(el => el.classList.remove('show-for-pdf'));
      document.body.removeChild(hiddenContainer);
      setIsPrinting(false);
    }
  };
  const [allCampaigns, setAllCampaigns] = useState([])

useEffect(() => {
  fetch('http://localhost:5000/api/periods')
    .then(res => res.json())
    .then(data => setAllCampaigns(data))
    .catch(err => console.error('Erreur de chargement des périodes:', err))
}, [])
const validateDate = (dateStr) => {
  const selected = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selected < today) {
    alert('❌ Cette date est déjà passée.');
    navigate('/home');
    return false;
  }

  // Find matching campaign (if any)
  const matched = allCampaigns.find(({ start_date, end_date }) => {
    const start = new Date(start_date);
    const end = new Date(end_date);
    return selected >= start && selected <= end;
  });

  if (type === 'normal') {
    if (matched) {
      alert(`❌ Cette date correspond à la campagne "${matched.name}". Veuillez aller dans la section campagne.`);
      navigate('/home');
      return false;
    }
    return true; // ✅ Date is outside campaigns, so allowed in normal
  }

  if (type === 'campagne') {
    if (!matched) {
      alert('❌ Vous devez aller à la section normale pour cette période.');
      navigate('/home');
      return false;
    }

    if (matched.name !== campaign?.name) {
      alert(`❌ Cette date correspond à "${matched.name}". Veuillez changer de campagne.`);
      navigate('/home');
      return false;
    }

    return true; // ✅ Date is inside the correct campaign
  }

  return false;
};



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
  .only-pdf,
.only-print {
  display: none;
}

@media print {
  .only-pdf,
  .only-print {
    display: block !important;
  }
}

.show-for-pdf {
  display: block !important;
}


`}</style>
<div
  ref={formRef}
>

    <div className="return-wrapper no-print">
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
          <div className="form-box only-print">
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
          value={formData.premierChoix}
          onChange={handleChange}
        />
      </td>
      {showSecondChoice && (
        <td>
          <input
            className="table-input"
            type="text"
            name="deuxiemeChoix"
            value={formData.deuxiemeChoix}
            onChange={handleChange}
          />
        </td>
      )}
      {showThirdChoice && (
        <td>
          <input
            className="table-input"
            type="text"
            name="troisiemeChoix"
            value={formData.troisiemeChoix}
            onChange={handleChange}
          />
        </td>
      )}
    </tr>
    <tr>
      <td>Période demandée (date de sortie non incluse)</td>
      <td>
        <div className="date-range">
          <input
            type="date"
            name="periodePremierDebut"
            value={formData.periodePremierDebut}
            onChange={handleChange}
          />
          <span>au</span>
          <input
            type="date"
            name="periodePremierFin"
            value={formData.periodePremierFin}
            onChange={handleChange}
          />
        </div>
      </td>
      {showSecondChoice && (
        <td>
          <div className="date-range">
            <input
              type="date"
              name="periodeDeuxiemeDebut"
              value={formData.periodeDeuxiemeDebut}
              onChange={handleChange}
            />
            <span>au</span>
            <input
              type="date"
              name="periodeDeuxiemeFin"
              value={formData.periodeDeuxiemeFin}
              onChange={handleChange}
            />
          </div>
        </td>
      )}
      {showThirdChoice && (
        <td>
          <div className="date-range">
            <input
              type="date"
              name="periodeTroisiemeDebut"
              value={formData.periodeTroisiemeDebut}
              onChange={handleChange}
            />
            <span>au</span>
            <input
              type="date"
              name="periodeTroisiemeFin"
              value={formData.periodeTroisiemeFin}
              onChange={handleChange}
            />
          </div>
        </td>
      )}
    </tr>
  </tbody>
</table>

          <div className="form-box only-pdf">
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
       <div className="no-print" style={{ textAlign: 'center', marginTop: '30px' }}>
      {!saved ? (
        <button
          onClick={() => setSaved(true)}
          style={{
            backgroundColor: '#007acc',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#005fa3')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#007acc')}
          disabled={isPrinting}
        >
          Enregistrer
        </button>
      ) : (
        <button
          onClick={handleImprimer}
          disabled={isPrinting}
          style={{
            backgroundColor: isPrinting ? '#b91c1c' : '#dc2626',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isPrinting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => {
            if (!isPrinting) e.currentTarget.style.backgroundColor = '#b91c1c';
          }}
          onMouseLeave={e => {
            if (!isPrinting) e.currentTarget.style.backgroundColor = '#dc2626';
          }}
        >
          {isPrinting ? 'Impression en cours...' : 'Imprimer'}
        </button>
      )}
    </div>

      </div>
    </>
  )
}