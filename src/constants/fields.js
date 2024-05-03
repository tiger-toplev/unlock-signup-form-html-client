export const mobileNumberPattern = '\\+61-\\d{3}-\\d{3}-\\d{3}';

const step1Fields = {
  firstName: {
    label: 'First Name',
    type: 'text',
    order: 1,
  },
  lastName: {
    label: 'Surname',
    type: 'text',
    order: 2,
  },
  companyName: {
    label: 'Business Name',
    type: 'text',
    order: 3,
  },
  emailAddress: {
    pattern:
      '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])',
    label: 'Email Address',
    type: 'email',
    order: 4,
  },
  mobileNumber: {
    pattern: mobileNumberPattern,
    label: 'Mobile Number',
    type: 'maskInput',
    defaultValue: '+61',
    placeholder: '+xx-xxx-xxx-xxx',
    mask: '+99-999-999-999',
    order: 5,
  },
};

const step2Fields = {
  agree: {
    label: 'Agree',
    type: 'checkbox',
    defaultValue: 'false',
    order: 0,
  },
};

const step3Fields = {
  agree: {
    label: 'Agree',
    type: 'checkbox',
    defaultValue: 'false',
    order: 0,
  },
};
const step5Fields = {
  name: {
    label: 'Name',
    type: 'text',
    order: 1,
  },
  abn: {
    label: 'ABN',
    type: 'text',
    order: 2,
  },
  acn: {
    label: 'ACN',
    type: 'text',
    order: 3,
  },
  status: {
    label: 'Status',
    type: 'text',
    order: 4,
  },
  tradingName: {
    label: 'Trading name',
    type: 'text',
    order: 5,
  },
  address: {
    label: 'Address',
    type: 'text',
    order: 6,
  },
};

const emptyFields = {};

const step7Fields = {
  id: {
    label: 'ID document(License)',
    type: 'file',
    defaultValue: 'false',
    order: 0,
  },
  photo: {
    label: 'Photo',
    type: 'file',
    defaultValue: 'false',
    order: 0,
  },
};

export const stepFields = [
  step1Fields,
  step2Fields,
  step3Fields,
  emptyFields,
  step5Fields,
  emptyFields,
  step7Fields,
  emptyFields,
  emptyFields,
  emptyFields,
  emptyFields,
];
