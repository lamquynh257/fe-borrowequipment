// lib/api.js
"use server";
import axios from "axios";
const qs = require("qs");

const AdLogin = async (username, password) => {
  try {
    let data = qs.stringify({
      user: username,
      pass: password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://api-server.ntt.edu.vn/api/loginad`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic YWRtaW46VGhhbmhsYW0xMjM=",
      },
      data: data,
    };

    const response = await axios.request(config);
    // console.log(JSON.stringify(response.data));
    return response.data; // or whatever data you want to return
  } catch (error) {
    console.error(error);
    throw error; // You may want to handle the error in a specific way or just rethrow it
  }
};

export default AdLogin;
