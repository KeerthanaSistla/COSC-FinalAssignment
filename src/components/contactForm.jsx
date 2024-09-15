import React, { useState, useEffect } from 'react';

const ContactForm = ({ addOrUpdateContact, currentContact, isEditing }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');

  useEffect(() => {
    if (isEditing && currentContact) {
      setName(currentContact.name);
      setEmail(currentContact.email);
      setPhone(currentContact.phone);
      setDescription(currentContact.description);
      setCategory(currentContact.category);
    }
  }, [isEditing, currentContact]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const contact = { name, email, phone, description, category, id: currentContact?.id };
    addOrUpdateContact(contact);
    setName('');
    setEmail('');
    setPhone('');
    setDescription('');
    setCategory('Personal');
  };

  return(
    <form onSubmit={handleSubmit}>
      <input
        id="name"
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Name" 
        required 
      />
      <input 
        id="email"
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input
        id="tel"
        type="tel"
        pattern="[+]+[0-9]*||[0-9]*"
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        placeholder="Phone number"
        required
      />
      <input
        id="description"
        type="text" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Description"
      />
        
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Personal">Personal</option>
        <option value="Professional">Professional</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit">
        {isEditing ? 'Update Contact' : 'Add Contact'}
      </button>
    </form>
  );
};

export default ContactForm;
