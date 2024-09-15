import React, { useState, useEffect } from 'react';
import './App.css';
import ContactForm from './components/contactForm';
import ContactList from './components/contactList';
import Papa from 'papaparse';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load contacts from localStorage when the app loads
  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (storedContacts && Array.isArray(storedContacts)) {
      setContacts(storedContacts);
    } else {
      console.log('No contacts found in localStorage or data is corrupted.');
    }
  }, []);

  // Save contacts to localStorage whenever the contacts state changes
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  const addOrUpdateContact = (contact) => {
    if (isEditing) {
      setContacts(contacts.map(c => (c.id === currentContact.id ? contact : c)));
      setIsEditing(false);
      setCurrentContact(null);
    } else {
      setContacts([...contacts, { ...contact, id: Date.now() }]);
    }
    disappear();
  };

  const handleEdit = (contact) => {
    appear();
    setCurrentContact(contact);
    setIsEditing(true);
  };

  const handleDelete = (contactId) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm) ||
    contact.email.toLowerCase().includes(searchTerm) ||
    contact.phone.includes(searchTerm) 
  );

  const personalContacts = filteredContacts.filter(contact => contact.category === "Personal");
  const professionalContacts = filteredContacts.filter(contact => contact.category === "Professional");
  const otherContacts = filteredContacts.filter(contact => contact.category === "Other");

  // Function to export contacts to CSV
  const exportToCSV = () => {
    const csvData = Papa.unparse(contacts);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contacts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to import contacts from CSV
  const importFromCSV = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        const importedContacts = results.data.map((contact, index) => ({
          ...contact,
          id: Date.now() + index
        }));
        setContacts([...contacts, ...importedContacts]);
      }
    });
  };

  const appear = () => {
    document.querySelector("form").style.display="flex";
  }
  
  const disappear = () => {
    document.querySelector("form").style.display="none";
  }
  

  return (
    <div className="App">
      <header><h1>Contact Manager</h1></header>
      <main>
        <div className="search">
          <div className="createSearch">
          <input 
            id="search"
            type="text" 
            placeholder="Search" 
            value={searchTerm} 
            onChange={handleSearch}
            className="search-input"
          />
          <button onClick={appear}>New contact</button>
          </div>

        </div>
        
        <div className="new">

          <ContactForm 
            addOrUpdateContact={addOrUpdateContact} 
            currentContact={currentContact} 
            isEditing={isEditing} 
          />
        </div>


        <div className="csv-controls">
          <button onClick={exportToCSV}>Export to CSV</button>
          <input id="import" type="file" accept=".csv" onChange={importFromCSV} />
        </div>

        <div className="heading"><h3>Personal Contacts</h3></div>
        <div className="personal">
          {personalContacts.length > 0 ? (
            <ContactList contacts={personalContacts} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <p>No contacts available.</p>
          )}
        </div>

        <div className="heading"><h3>Professional Contacts</h3></div>
        <div className="professional">
          {professionalContacts.length > 0 ? (
            <ContactList contacts={professionalContacts} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <p>No contacts available.</p>
          )}
        </div>

        <div className="heading"><h3>Other Contacts</h3></div>
        <div className="other">
          {otherContacts.length > 0 ? (
            <ContactList contacts={otherContacts} onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <p>No contacts available.</p>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;