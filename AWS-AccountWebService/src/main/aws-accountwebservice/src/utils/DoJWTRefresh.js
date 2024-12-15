import axios from "axios";
//import { useNavigate } from "react-router-dom";

export const DoJWTRefresh = () => {
  //const navigate = useNavigate();

  let url = process.env.REACT_APP_DOMAIN+"/"+process.env.REACT_APP_URL + '/jwtrefresh';

  const JWTRefresh = async () => {
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
            const newWindow = window.open("", "_self");
            //let url = "http://"+process.env.REACT_LOCAL_DOMAIN+'/components/MainPage/Main';
            let url = '/components/MainPage/Main';
            newWindow.location.href = url;
          }
        } else if (resultMessage == 'Refresh Token Expired') {
          alert('세션이 만료되었습니다.\n다시 로그인 하여 주세요.');
          localStorage.removeItem('access');
          const newWindow = window.open("", "_self");
          let url = '/';
          newWindow.location.href = url;
          //navigate("/", { state: { isBack: true } });
        } else if (resultMessage == 'Cookie is null') {
          alert('세션이 만료되었습니다.\n다시 로그인 하여 주세요.');
          localStorage.removeItem('access');
          const newWindow = window.open("", "_self");
          let url = '/';
          newWindow.location.href = url;
        }
      } else {
        alert(resultMessage);
      }
    } catch(error){
      alert("DoJWTRefresh = "+error);
    }
  };
  
  return JWTRefresh();
};