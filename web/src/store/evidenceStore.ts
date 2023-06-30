import { create } from 'zustand'
import { Evidence } from '../typings';

const initialNewEvidence = {
  id: 0,
  type: '',
  title: '',
  notes: '',
  involvedCitizens: [''],
  tags: [],
  timeStamp: new Date(),
  createdBy: { 
    citizenid: '', 
    firstname: '', 
    lastname: '', 
  },
};

export const useStoreEvidence = create<Evidence>((set) => ({
  evidence: [{
    id: 1,
    type: 'Testimonial',
    title: 'This is test evidence',
    notes: '',
    involvedCitizens: [''],
    tags: [],
    timeStamp: new Date(),
    createdBy: { 
      citizenid: 'CITI12345', 
      firstname: 'Bubble', 
      lastname: 'Test', 
    },
  }],
  selectedEvidence: null,
  newEvidence: {...initialNewEvidence},
}))