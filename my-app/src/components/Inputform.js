import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import Translatedform from './Translatedform';

export default function Inputform(props) {
  const {
    Name = "Name",
    ContactNumber = "ContactNumber",
    DateOfBirth = "DateOfBirth",
    Age = "Age",
    Gender = "Gender",
    Email = "Email",
    Status = "Status",
    HouseNo = "HouseNo",
    Street = "Street",
    Landmark = "Landmark",
    PostalCode = "PostalCode",
    City = "City",
    State = "State",
    District = "District",
    Country = "Country",
    Government_Id = "Government Identity",
    AadharCard = "AadharCard",
    VoterId = "VoterId",
    Passport = "Passport",
    PanCard = "PanCard",
    DrivingLicense = "DrivingLicense",
    Government_Id_Number = "Government Identity Number",
    DetailsOf = "DetailsOf",
    Father = "Father",
    Mother = "Mother",
    Sister = "Sister",
    Brother = "Brother",
    Spouse = "Spouse",
    select = "Select",
    male = "Male",
    female = "Female",
    other = "Other",
    single = "Single",
    married = "Married",
    divorced = "Divorced",
    fullName = "FullName",
    submit = "Submit"
  } = props.labels || {};

  const [translatedData, setTranslatedData] = useState(null);
  const [objectId, setObjectId] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    dob: '',
    age: '',
    gender: '',
    email: '',
    status: '',
    houseNo: '',
    street: '',
    landmark: '',
    postalCode: '',
    city: '',
    state: '',
    district: '',
    country: '',
    govtId: '',
    govtIDNo: '',
    detailsOf: '',
    relationName: '',
    relationgovtId: '',
    relationgovtIDNo: ''
  });

  const [selectedRelation, setSelectedRelation] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:5001/submitForm', { ...formData, sourceLang: props.sourceLang, targetLang: props.targetLang })
      .then(response => {
        const receivedObjectId = response.data.objectId;
        console.log('Received ObjectId:', receivedObjectId);
        setObjectId(receivedObjectId);
      })
      .catch(error => {
        alert('Error saving data!');
        console.error(error);
      });
  };

  useEffect(() => {
    if (objectId) {
      axios.get(`http://127.0.0.1:5001/getTranslatedData/${objectId}`)
        .then(response => {
          setTranslatedData(response.data.translatedData);
          alert('Data saved successfully!');
          setFormData({
            name: '',
            contact: '',
            dob: '',
            age: '',
            gender: '',
            email: '',
            status: '',
            houseNo: '',
            street: '',
            landmark: '',
            postalCode: '',
            city: '',
            state: '',
            district: '',
            country: '',
            govtId: '',
            govtIDNo: '',
            detailsOf: '',
            relationName: '',
            relationgovtId: '',
            relationgovtIDNo: ''
          });
          setFormSubmitted(true);
          setSelectedRelation('');
          console.log('Form submitted successfully with ObjectId:', objectId);
        })
        .catch(error => {
          alert('Error fetching translated data!');
          console.error(error);
        });
    }
  }, [objectId]);


  
  return (<>
    <div className="form">
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">{Name}:</label>
          <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="contact" className="form-label">{ContactNumber}:</label>
          <input type="text" className="form-control" id="contact" value={formData.contact} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="dob" className="form-label">{DateOfBirth}:</label>
          <input type="date" className="form-control" id="dob" value={formData.dob} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="age" className="form-label">{Age}:</label>
          <input type="text" className="form-control" id="age" value={formData.age} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="gender" className="form-label">{Gender}:</label>
          <select id="gender" className="form-select" value={formData.gender} onChange={handleChange}>
            <option value="" disabled>{select}</option>
            <option value="male">{male}</option>
            <option value="female">{female}</option>
            <option value="other">{other}</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">{Email}:</label>
          <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="status" className="form-label">{Status}:</label>
          <select id="status" className="form-select" value={formData.status} onChange={handleChange}>
            <option value="" disabled>{select}</option>
            <option value="single">{single}</option>
            <option value="married">{married}</option>
            <option value="divorced">{divorced}</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="houseNo" className="form-label">{HouseNo}:</label>
          <input type="text" className="form-control" id="houseNo" value={formData.houseNo} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="street" className="form-label">{Street}:</label>
          <input type="text" className="form-control" id="street" value={formData.street} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="landmark" className="form-label">{Landmark}:</label>
          <input type="text" className="form-control" id="landmark" value={formData.landmark} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="postalCode" className="form-label">{PostalCode}:</label>
          <input type="text" className="form-control" id="postalCode" value={formData.postalCode} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="city" className="form-label">{City}:</label>
          <input type="text" className="form-control" id="city" value={formData.city} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="state" className="form-label">{State}:</label>
          <input type="text" className="form-control" id="state" value={formData.state} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="district" className="form-label">{District}:</label>
          <input type="text" className="form-control" id="district" value={formData.district} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="country" className="form-label">{Country}:</label>
          <input type="text" className="form-control" id="country" value={formData.country} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="Government_Id" className="form-label">{Government_Id}:</label>
          <select id="govtId" className="form-select" value={formData.govtId} onChange={handleChange}>
            <option value="" disabled>{select}</option>
            <option value="aadhar">{AadharCard}</option>
            <option value="voter">{VoterId}</option>
            <option value="passport">{Passport}</option>
            <option value="pan">{PanCard}</option>
            <option value="drivingLicense">{DrivingLicense}</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="Government_Id_Number" className="form-label">{Government_Id_Number}:</label>
          <input type="text" className="form-control" id="govtIDNo" value={formData.govtIDNo} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="detailsOf" className="form-label">{DetailsOf}:</label>
          <select id="detailsOf" className="form-select" value={formData.detailsOf} onChange={(e) => {
            handleChange(e);
            setSelectedRelation(e.target.value);
          }}>
            <option value="" disabled>{select}</option>
            <option value="father">{Father}</option>
            <option value="mother">{Mother}</option>
            <option value="sister">{Sister}</option>
            <option value="brother">{Brother}</option>
            <option value="spouse">{Spouse}</option>
          </select>
        </div>
        {selectedRelation && (
  <>
    <div className="col-md-6">
      <label htmlFor="relationName" className="form-label">{fullName}:</label>
      <input
        type="text"
        className="form-control"
        id="relationName"
        value={formData.relationName}
        onChange={handleChange}
      />
    </div>
    <div className="col-md-6">
      <label htmlFor="relationgovtId" className="form-label">{Government_Id}:</label>
      <select
        id="relationgovtId"
        className="form-select"
        value={formData.relationgovtId}
        onChange={handleChange}
      >
        <option value="" disabled>{select}</option>
        <option value="aadhar">{AadharCard}</option>
        <option value="voter">{VoterId}</option>
        <option value="passport">{Passport}</option>
        <option value="pan">{PanCard}</option>
        <option value="drivingLicense">{DrivingLicense}</option>
      </select>
    </div>
    <div className="col-md-6">
      <label htmlFor="relationgovtIDNo" className="form-label">{Government_Id_Number}:</label>
      <input
        type="text"
        className="form-control"
        id="relationgovtIDNo"
        value={formData.relationgovtIDNo}
        onChange={handleChange}
      />
    </div>
  </>
)}
        <div className="col-md-12">
          <button type="submit" className="btn-custom" onClick = {handleSubmit}>{submit}</button>
        </div>
      </form>
      </div><div>
      {formSubmitted && <Translatedform objid={objectId}/>}
      </div></>
    );
}