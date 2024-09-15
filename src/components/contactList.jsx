import React from 'react';

const ContactList = ({ contacts, onEdit, onDelete }) => {
  return (
    <div>
      {contacts.map((contact) => (
        <div id="card" key={contact.id}>
          <h5>{contact.name}</h5>
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
          <p>{contact.description}</p>
          <button class="card" id="edit" onClick={() => onEdit(contact)}>Edit</button>
          <button class="card" id="delete" onClick={() => onDelete(contact.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
