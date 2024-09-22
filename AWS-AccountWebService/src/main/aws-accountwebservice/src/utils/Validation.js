export const Validation = (validationMessages, setValidationMessage, type, type2, value) => {
  
  if (type === undefined || type2 === undefined || value === undefined || setValidationMessage === undefined)
    return;

  if (type === 'userID') {
    if (value.trim() === "") {
      setValidationMessage(validationMessages => ({...validationMessages, userIDValidationMessage: '아이디를 입력하세요'}));
    } else {
      setValidationMessage(validationMessages => ({...validationMessages, userIDValidationMessage: ''}));
    }
  } else if (type === 'userVerifyID') {
    if(type2 ==='available') {
      setValidationMessage(validationMessages => ({...validationMessages, userIDValidationMessage: '사용가능한 아이디입니다.'}));
    } else if (type2 === 'exists'){
      setValidationMessage(validationMessages => ({...validationMessages, userIDValidationMessage: '사용중인 아이디가 있습니다.'}));
    } else {
      setValidationMessage(validationMessages => ({...validationMessages, userIDValidationMessage:'오른쪽에 인증하기 버튼을 누러 인증하세요'}));
    }
  } else if (type === 'userPWD') {
    if (value.trim() === "") {
      setValidationMessage(validationMessages => ({...validationMessages, userPWDValidationMessage: '비밀번호를 입력하세요'}));
    } else {
      setValidationMessage(validationMessages => ({...validationMessages, userPWDValidationMessage: ''}));
    }
  } else if (type === 'userPWDConfirm') {
    if (value.trim() === "") {
      setValidationMessage(validationMessages => ({...validationMessages, userPWDConfirmValidationMessage: '비밀번호를 입력하세요'}));
    } else {
      if (type2 == 'notEuqal') {
        setValidationMessage(validationMessages => ({...validationMessages, userPWDConfirmValidationMessage: '비밀번호가 맞지 않습니다. 다시 입력해주세요.'}));
      } else {
        setValidationMessage(validationMessages => ({...validationMessages, userPWDConfirmValidationMessage: ''}));
      }
    }
  } else if (type === 'userName') {
    if (value.trim() === "") {
      setValidationMessage(validationMessages => ({...validationMessages, userNameValidationMessage: '이름을 입력하세요'}));
    } else {
      setValidationMessage(validationMessages => ({...validationMessages, userNameValidationMessage: ''}));
    }
  } else if (type === 'userPhone') {
    if (value.trim() === "") {
      setValidationMessage(validationMessages => ({...validationMessages, userPhoneValidationMessage: '전화번호를 입력하세요'}));
    } else {
      setValidationMessage(validationMessages => ({...validationMessages, userPhoneValidationMessage: ''}));
    }
  } else if (type === 'userVerifyPhone') {
    if (value.trim() === "") {
      setValidationMessage(validationMessages => ({...validationMessages, userPhoneValidationMessage: '전화번호가 잘못되었습니다.'}));
    } else {
      if (type2 === 'sendding') {
        setValidationMessage(validationMessages => ({...validationMessages, userPhoneValidationMessage: '전송되었습니다.'}));
      } else if (type2 === 'available') {
        setValidationMessage(validationMessages => ({...validationMessages, userPhoneValidationMessage: '인증되었습니다.'}));
      } else if (type2 === 'error') {
        setValidationMessage(validationMessages => ({...validationMessages, userPhoneValidationMessage: '인증번호가 잘못되었습니다.'}));
      } else if (type2 === 'notVerifyPhone'){
        setValidationMessage(validationMessages => ({...validationMessages, userPhoneValidationMessage: '핸드폰 인증을 진행하세요'}));
      } else {
        setValidationMessage(validationMessages => ({...validationMessages, userPhoneValidationMessage: ''}));
      }
    }
  } else if (type === 'userEmail') {
    if (value.trim() === "") {
      setValidationMessage(validationMessages => ({...validationMessages, userEmailValidationMessage: '이메일을 입력하세요'}));
    } else {
      setValidationMessage(validationMessages => ({...validationMessages, userEmailValidationMessage: ''}));
    }
  } else if (type === 'userAlias') {
    if (value.trim() === "") {
      setValidationMessage(validationMessages => ({...validationMessages, userAliasValidationMessage: '별명을 입력하세요'}));
    } else {
      setValidationMessage(validationMessages => ({...validationMessages, userAliasValidationMessage: ''}));
    }
  }
};