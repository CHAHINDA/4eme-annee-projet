import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('nom_complet');
  const [sortOrder, setSortOrder] = useState('asc'); // or 'desc'

  const API_BASE_URL = 'http://localhost:5000';
  const today = new Date().toLocaleDateString('fr-FR');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleRetour = () => navigate('/admin');

  const handleExportCSV = () => {
    const headers = ['Nom complet', 'Matricule', 'Email', 'Téléphone', 'Situation familiale', 'Nbre enfants', 'Rôle', "Date d'affectation"];
    const rows = users.map(user => [
      user.nom_complet,
      user.matricule,
      user.email,
      user.telephone || '',
      user.situation_familiale || '',
      user.nombre_enfants_beneficiaires || '',
      user.role,
      user.date_affectation_au_bureau ? new Date(user.date_affectation_au_bureau).toLocaleDateString('fr-FR') : '',
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'users_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text('Marsa Maroc / DEPL', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Liste des utilisateurs enregistrés', doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Date d'impression: ${today}`, 14, 35);

    const headers = [['Nom', 'Matricule', 'Email', 'Téléphone', 'Situation', 'Enfants', 'Rôle', "Date"]];
    const rows = users.map(user => [
      user.nom_complet,
      user.matricule,
      user.email,
      user.telephone || '',
      user.situation_familiale || '',
      user.nombre_enfants_beneficiaires || '',
      user.role,
      user.date_affectation_au_bureau ? new Date(user.date_affectation_au_bureau).toLocaleDateString('fr-FR') : '',
    ]);

    autoTable(doc, {
      startY: 40,
      head: headers,
      body: rows,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 122, 204], textColor: 255 },
    });

    doc.save('users_list.pdf');
  };

 const handleModify = (matricule) => {
  navigate(`/users/edit/${matricule}`);  // Example route for edit mode
};


const handleDelete = async (matricule) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${matricule}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setUsers(users.filter(user => user.matricule !== matricule));
    } catch (error) {
      alert(error.message);
    }
  }
};



  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredUsers = users.filter(user =>
    user.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valueA = a[sortKey]?.toLowerCase?.() || '';
    const valueB = b[sortKey]?.toLowerCase?.() || '';
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Erreur: {error}</p>;
  

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap');

        body {
          font-family: 'Urbanist', sans-serif;
          background: linear-gradient(135deg, #dbe9f4, #e1e8ea);
          margin: 0;
          padding: 0;
        }

        .user-list-container {
          max-width: 1500px;
          margin: 40px auto;
          padding: 40px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(18px);
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
          animation: fadeIn 1s ease-in-out;
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(40px) rotateX(5deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
          }
        }

        .retour-btn {
          background-color: #607d8b;
          color: white;
          padding: 10px 24px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.3s ease;
          margin-bottom: 20px;
        }

        .retour-btn:hover {
          transform: translateY(-2px) scale(1.03);
        }

        .user-list-container h2 {
          color: #0b2545;
          margin-bottom: 10px;
          font-size: 2rem;
          text-align: center;
        }

        .user-list-container p {
          margin-bottom: 20px;
          color: #444;
          text-align: center;
        }

        .stats-bar {
          font-weight: bold;
          color: #333;
          margin-bottom: 16px;
          text-align: center;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        thead {
          background-color: #007acc;
          color: white;
        }

        th, td {
          padding: 14px 20px;
          text-align: left;
          font-size: 1rem;
        }

        tr:not(:last-child) {
          border-bottom: 1px solid #eee;
        }

        td.actions {
          display: flex;
          gap: 10px;
        }

        .btn-action {
          padding: 6px 14px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-modify {
          background-color: #f0ad4e;
          color: white;
        }

        .btn-modify:hover {
          background-color: #ec971f;
        }

        .btn-delete {
          background-color: #d9534f;
          color: white;
        }

        .btn-delete:hover {
          background-color: #c9302c;
        }

        .empty-row td {
          color: #aaa;
          font-style: italic;
          text-align: center;
        }

        .pagination-info {
          margin-top: 20px;
          text-align: center;
          font-weight: 600;
          color: #666;
        }

      .button-row {
  max-width: 1000px; /* same as .user-list-container */
  margin: 40px auto 0 auto; /* top margin + centered horizontally */
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 40px; /* same horizontal padding as container */
}


        .btn {
          padding: 10px 24px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          color: white;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, background 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px) scale(1.03);
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn-retour {
          background-color: #607d8b;
        }

        .btn-pdf {
          background-color: #e53935;
        }

        .btn-csv {
          background-color: #43a047;
        }
      `}</style>

<div className="button-row">
        <button className="btn btn-pdf" onClick={handleExportPDF}>Exporter PDF</button>
        <button className="btn btn-csv" onClick={handleExportCSV}>Exporter CSV</button>
        <button className="btn btn-retour" onClick={handleRetour}>← Retour</button>
      </div>

      <div className="user-list-container">
        <h2>Liste des utilisateurs</h2>
        <p>Total utilisateurs : {users.length}</p>
  <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: '16px',
    flexWrap: 'wrap',
  }}
>
  <input
    type="text"
    placeholder="🔍 Rechercher par nom, matricule ou rôle..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      flexGrow: 1,
      maxWidth: 600,
      padding: '12px 16px',
      borderRadius: 12,
      border: '1px solid #ccc',
      fontSize: 16,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    }}
    onFocus={(e) => (e.target.style.border = '1.5px solid #3b82f6')}
    onBlur={(e) => (e.target.style.border = '1px solid #ccc')}
  />

  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <span style={{ fontWeight: 600, color: '#555' }}>Trier par :</span>
    {['nom_complet', 'matricule', 'role'].map((key) => (
      <button
        key={key}
        onClick={() => handleSort(key)}
        style={{
          padding: '8px 14px',
          fontSize: 14,
          fontWeight: sortKey === key ? '700' : '500',
          color: sortKey === key ? 'white' : '#3b82f6',
          backgroundColor: sortKey === key ? '#3b82f6' : 'transparent',
          border: '1.5px solid #3b82f6',
          borderRadius: 10,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: sortKey === key ? '0 4px 10px rgba(59,130,246,0.4)' : 'none',
        }}
        onMouseEnter={e => {
          if (sortKey !== key) e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.1)';
        }}
        onMouseLeave={e => {
          if (sortKey !== key) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {key === 'nom_complet' ? 'Nom' : key.charAt(0).toUpperCase() + key.slice(1)}
        {sortKey === key ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''}
      </button>
    ))}
  </div>
</div>





        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Matricule</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Situation</th>
              <th>Enfants</th>
              <th>Rôle</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{user.nom_complet}</td>
                <td>{user.matricule}</td>
                <td>{user.email}</td>
                <td>{user.telephone || '-'}</td>
                <td>{user.situation_familiale || '-'}</td>
                <td>{user.nombre_enfants_beneficiaires || 0}</td>
                <td>{user.role}</td>
                <td>{user.date_affectation_au_bureau
                  ? new Date(user.date_affectation_au_bureau).toLocaleDateString('fr-FR')
                  : '-'}</td>
                <td className="actions">
                  <button className="btn-action btn-modify" onClick={() => handleModify(user.matricule)}>Modifier</button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(user.matricule)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-info">
         
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} style={{
              margin: '0 5px',
              padding: '6px 10px',
              fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
              background: currentPage === i + 1 ? '#007acc' : '#e0e0e0',
              color: currentPage === i + 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '6px'
            }}>
              {i + 1}
            </button>
          ))}
          <br />
           Page {currentPage} / {totalPages}
          <br />
        </div>
      </div>
    </>
  )
}
