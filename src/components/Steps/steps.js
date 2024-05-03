import BankAccountDetails from './default/BankAccountDetails';
import CompanyIdentification from './default/CompanyIdentification';
import AdditionalInput from './default/AdditionalInput';
import Congratulations from './default/Congratulations';
import DirectorsList from './default/DirectorsList';
import Step1 from './default/Step1';
import Verification from './default/Verification';
import UnlockMasterCard from './default/UnlockMasterCard';

import CreditCheckFailed from './creditCheckFailed/CreditCheckFailed';
import SuccessScreen from './default/Success';

/**
 * @type {Record<import('../../context/UserContext').FormPath, {title: string, step: typeof Step1 }[]>}
 */
export const steps = {
  default: [
    { title: 'Your details', step: Step1 },
    { title: 'ID verification code', step: Verification },
    { title: 'Business verification', step: CompanyIdentification },
    { title: 'Congratulations!', step: Congratulations },
    { title: 'Nominate director\'s in charge<br/> of UnLock Account', step: DirectorsList },
    { title: 'Which bank account to debit<br/> to repay?', step: BankAccountDetails },
    { title: 'Who will receive an<br/> UnLock Mastercard<sup>&reg;</sup>', step: UnlockMasterCard },
    { title: "You're all set!", step: SuccessScreen },
  ],
  businessCheckFailed: [
    { title: 'Uh-oh!', step: CreditCheckFailed },
    { title: 'You are referred', step: SuccessScreen },
  ],
  creditCheckFailed: [
    { title: 'Application Unsuccessful', step: CreditCheckFailed },
    { title: 'You are referred', step: SuccessScreen },
  ],
  additionals: [{ title: 'Additional personal information', step: AdditionalInput }],
};

// const endpoints = [
//   'https://dev.unlock.marketlend.com.au/api/signup/details',
//   'https://dev.unlock.marketlend.com.au/api/signup/privacy',
//   'https://dev.unlock.marketlend.com.au/api/signup/terms',
//   'https://dev.unlock.marketlend.com.au/api/signup/company-search',
//   'https://dev.unlock.marketlend.com.au/api/signup/company-search-results',
//   'https://dev.unlock.marketlend.com.au/api/signup/confirm-company',
//   'https://dev.unlock.marketlend.com.au/api/signup/credit-report',
//   'https://dev.unlock.marketlend.com.au/api/signup/directors',
//   'https://dev.unlock.marketlend.com.au/api/signup/id-check',
// ];
