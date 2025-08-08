import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Translatedform(props) {
  // Initialize state with default values to avoid uncontrolled inputs
  const [data, setData] = useState({
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
    relationGovtId: '',
    relationGovtIDNo: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/getTranslatedData/${props.objid}`)
        console.log('Fetched data:', response.data);
        const fetchedData = response.data.translated_data || {};
        setData({
          name: response.data.name || '',
          contact: response.data.contact || '',
          dob: response.data.dob || '',
          age: response.data.age || '',
          gender: response.data.gender || '',
          email: response.data.email || '',
          status: response.data.status || '',
          houseNo: response.data.houseNo || '',
          street: response.data.street || '',
          landmark: response.data.landmark || '',
          postalCode: response.data.postalCode || '',
          city: response.data.city || '',
          state: response.data.state || '',
          district: response.data.district || '',
          country: response.data.country || '',
          govtId: response.data.govtId || '',
          govtIDNo: response.data.govtIDNo || '',
          detailsOf: response.data.detailsOf || '',
          relationName: response.data.relationName || '',
          relationgovtId: response.data.relationgovtId || '',
          relationgovtIDNo: response.data.relationgovtIDNo || ''
        });
      } catch (error) {
        console.error('Error fetching translated data:', error);
      }
    };
    if (props.objid) {
      fetchData();
    }
  }, [props.objid]);

  return (
    <div className="form1">
      <h2 className="formTitle">Translated Form</h2>
      <form className="row ">
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Name:</label>
          <input type="text" className="form-control" id="name" value={data.name || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="contact" className="form-label">Contact Number:</label>
          <input type="text" className="form-control" id="contact" value={data.contact || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="dob" className="form-label">Date of Birth:</label>
          <input type="date" className="form-control" id="dob" value={data.dob || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="age" className="form-label">Age:</label>
          <input type="text" className="form-control" id="age" value={data.age || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="gender" className="form-label">Gender:</label>
          <input type="text" className="form-control" id="gender" value={data.gender || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" className="form-control" id="email" value={data.email || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="status" className="form-label">Status:</label>
          <input type="text" className="form-control" id="status" value={data.status || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="houseNo" className="form-label">House No:</label>
          <input type="text" className="form-control" id="houseNo" value={data.houseNo || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="street" className="form-label">Street:</label>
          <input type="text" className="form-control" id="street" value={data.street || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="landmark" className="form-label">Landmark:</label>
          <input type="text" className="form-control" id="landmark" value={data.landmark || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="postalCode" className="form-label">Postal Code:</label>
          <input type="text" className="form-control" id="postalCode" value={data.postalCode || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="city" className="form-label">City:</label>
          <input type="text" className="form-control" id="city" value={data.city || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="state" className="form-label">State:</label>
          <input type="text" className="form-control" id="state" value={data.state || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="district" className="form-label">District:</label>
          <input type="text" className="form-control" id="district" value={data.district || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="country" className="form-label">Country:</label>
          <input type="text" className="form-control" id="country" value={data.country || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="govtId" className="form-label">Government ID:</label>
          <input type="text" className="form-control" id="govtId" value={data.govtId || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="govtIDNo" className="form-label">Government ID Number:</label>
          <input type="text" className="form-control" id="govtIDNo" value={data.govtIDNo || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="detailsOf" className="form-label">Details Of:</label>
          <input type="text" className="form-control" id="detailsOf" value={data.detailsOf || ''} readOnly />
        </div>
        {data.relationName && (
          <>
            <div className="col-md-6">
          <label htmlFor="relationName" className="form-label">Relation Name:</label>
          <input type="text" className="form-control" id="relationName" value={data.relationName || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="relationgovtId" className="form-label">Relation Government ID:</label>
          <input type="text" className="form-control" id="relationgovtId" value={data.relationgovtId || ''} readOnly />
        </div>
        <div className="col-md-6">
          <label htmlFor="relationgovtIDNo" className="form-label">Relation Government ID Number:</label>
          <input type="text" className="form-control" id="relationgovtIDNo" value={data.relationgovtIDNo || ''} readOnly />
        </div>
          </>
        )}
      </form>
    </div>
  );
}