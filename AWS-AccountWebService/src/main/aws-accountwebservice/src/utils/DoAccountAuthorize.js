import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
//import { useNavigate } from "react-router-dom";

export function DoAccountAuthorize() {
  const navigate = useNavigate();
  const queryParams = useLocation().search;
  const parsed = queryString.parse(queryParams);
  const code = parsed.code;
  const scope = parsed.scope;
  const client_info = parsed.client_info;
  const state = parsed.state;


  let url = process.env.REACT_APP_DOMAIN+""+process.env.REACT_APP_ACCOUNT_URL + '/account/authorize';
debugger;
  const AccountAuthorize = async () => {
  try {
      const res = await axios({
        method: "POST",
        url: url,
        data: "",
        // header에서 JSON 타입의 데이터라는 것을 명시
        headers: {
          'Content-type': 'application/json',
        },
        withCredentials: true // cookie 보내기
      });

      const result = res.data;
      const resultStatus = result.status;
      const resultMessage = result.result;
      const resultData = result.data;
      if (resultStatus == 'Success') {
        if (resultMessage == 'Success') {
          const accessToken = res.headers.get('access');
          if (accessToken) {
            localStorage.setItem('access', accessToken);
          }
        } else if (resultMessage == 'Refresh Token Expired') {
          alert('세션이 만료되었습니다.\n다시 로그인 하여 주세요.');
          //navigate("/", { state: { isBack: true } });
        } 
      } else {
        alert(resultMessage);
      }
    } catch(error){
      alert(error);
    }
  };
  
  return AccountAuthorize();
};

export default DoAccountAuthorize;
