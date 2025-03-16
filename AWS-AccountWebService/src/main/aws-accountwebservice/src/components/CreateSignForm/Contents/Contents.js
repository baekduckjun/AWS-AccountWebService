import React from "react";
import { Validation } from 'utils/Validation'; // utile.js 파일을 가져옴
const Contents = ({
  contents,
  userData,
  setUserData,
  validationMessages,
  setValidationMessages,
  verifyID,
  setIsVerifyID,
  isVerifyID,
  preUserID,
  verifyPhonePopupOpen,
  isVerifyPhone
}) => {
  const getValueByType = (type) => {
    switch (type) {
      case "ID":
        return userData.userID;
      case "PWD":
        return userData.userPWD;
      case "PWD_CONFIRM":
        return userData.userPWDConfirm;
      case "NAME":
        return userData.userName;
      case "PHONE":
        return userData.userPhone;
      case "EMAIL":
        return userData.userEmail;
      case "ALIAS":
        return userData.userAlias;
      default:
        return "";
    }
  };

  return (
    <form>
      {contents?.list?.length > 0 &&
        contents.list.map(content => {
          return (
            <div className='input-id' key={`${content.type}-${content.idx}`}>
              <input
                  type={content.inputType}
                  placeholder={content.title}
                  value={getValueByType(content.type)}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (content.type === "ID") {
                      setUserData({ ...userData, userID: value });
                      setIsVerifyID(false);
                      Validation(validationMessages, setValidationMessages, 'userVerifyID', '', value);
                    } else if (content.type === "PWD") {
                      setUserData({ ...userData, userPWD: value });
                    } else if (content.type === "PWD_CONFIRM") {
                      setUserData({ ...userData, userPWDConfirm: value });
                    } else if (content.type === "NAME") {
                      setUserData({ ...userData, userName: value });
                    } else if (content.type === "EMAIL") {
                      setUserData({ ...userData, userEmail: value });
                    } else if (content.type === "ALIAS") {
                      setUserData({ ...userData, userAlias: value });
                    }
                  }}
                  onBlur={() => {
                    if (content.type === "ID") {
                      Validation(validationMessages, setValidationMessages, 'userID', 'pass', userData.userID);
                    } else if (content.type === "PWD") {
                      Validation(validationMessages, setValidationMessages, 'password', 'pass', userData.userPWD);
                    } else if (content.type === "PWD_CONFIRM") {
                      Validation(validationMessages, setValidationMessages, 'userPWDConfirm', userData.userPWD, userData.userPWDConfirm);
                    } else if (content.type === "NAME") {
                      Validation(validationMessages, setValidationMessages, 'userName', 'pass', userData.userName);
                    } else if (content.type === "EMAIL") {
                      Validation(validationMessages, setValidationMessages, 'userEmail', 'pass', userData.userEmail);
                    } else if (content.type === "ALIAS") {
                      Validation(validationMessages, setValidationMessages, 'userAlias', 'pass', userData.userAlias);
                    }
                  }}
                  disabled={content.isDisabled}
              />

              {content.type === "ID" && (
                <button type="button" className="verify-button" onClick={verifyID}>인증하기</button>
              )}
              {content.type === "PHONE" && (
                <button type="button" onClick={verifyPhonePopupOpen}>휴대폰 인증하기</button>
              )}
              
              {contents.type === "USER" && (
                <>
                  {content.type === "ID" && (
                    <div className={(isVerifyID && preUserID == userData.userID) ? 'info-validation' : 'error-validation'}>
                      {validationMessages.userIDValidationMessage}&nbsp;
                    </div>
                  )}
                  {content.type === "PWD" && (
                    <div className='error-validation'>
                      {validationMessages.userPWDValidationMessage}&nbsp;
                    </div>
                  )}
                  {content.type === "PWD_CONFIRM" && (
                    <div className='error-validation'>
                      {validationMessages.userPWDConfirmValidationMessage}&nbsp;
                    </div>
                  )}
                  {content.type === "NAME" && (
                    <div className='error-validation'>
                      {validationMessages.userNameValidationMessage}&nbsp;
                    </div>
                  )}
                  {content.type === "PHONE" && (
                    <div className={isVerifyPhone ? 'info-validation' : 'error-validation'}>
                      {validationMessages.userPhoneValidationMessage}&nbsp;
                    </div>
                  )}
                  {content.type === "EMAIL" && (
                    <div className='error-validation'>
                      {validationMessages.userEmailValidationMessage}&nbsp;
                    </div>
                  )}
                  {content.type === "ALIAS" && (
                    <div className='error-validation'>
                      {validationMessages.userAliasValidationMessage}&nbsp;
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })
      }
    </form>
  )
};

export default Contents;