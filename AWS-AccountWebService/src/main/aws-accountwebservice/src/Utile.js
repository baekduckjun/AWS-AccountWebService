export const validation = (type, value, setErrorMessage) => {
  if (type === 'id') {
    if (value.trim() === "") {
      setErrorMessage('아이디를 입력하세요');
    } else {
      setErrorMessage('');
    }
  } else if (type === 'pwd') {
    if (value.trim() === "") {
      setErrorMessage('비밀번호를 입력하세요');
    } else {
      setErrorMessage('');
    }
  } else if (type === 'pwdConfirm') {
    if (value.trim() === "") {
      setErrorMessage('비밀번호를 입력하세요');
    } else {
      setErrorMessage('');
    }
  } else if (type === 'name') {
    if (value.trim() === "") {
      setErrorMessage('이름을 입력하세요');
    } else {
      setErrorMessage('');
    }
  } else if (type === 'phone') {
    if (value.trim() === "") {
      setErrorMessage('폰을 입력하세요');
    } else {
      setErrorMessage('');
    }
  } else if (type === 'email') {
    if (value.trim() === "") {
      setErrorMessage('이메일을 입력하세요');
    } else {
      setErrorMessage('');
    }
  } else if (type === 'alias') {
    if (value.trim() === "") {
      setErrorMessage('별명을 입력하세요');
    } else {
      setErrorMessage('');
    }
  }
};