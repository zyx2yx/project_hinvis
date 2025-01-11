import axios from "axios";


const G1Graph = function(data) {
    // console.log(data);
    return axios.get("http://localhost:3000/G1", {
      params: { gangData: data },
    });
}

export {G1Graph}
