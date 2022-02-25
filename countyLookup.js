const csv = require("csv-parser");
const fs = require("fs");
const { parse } = require("json2csv");
const axios = require("axios");

const sortThem = () => {
  const results = [];
  const masterArr = [];
  const apiKey =
    "AtrOUvbqs6Pu_4eiWDZ2xT97c2g-VOPU0C8I5XMMjZqX_PVmXgmG9dWwR3rnFZXp";

  fs.createReadStream("./data/addresses.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      results.map((e) => {
        let obj = {
          street1: e.street1,
          city: e.city,
          state: e.state,
          zip: parseInt(e.zip),
        };

        masterArr.push(obj);
      });

      let tempArr = [];
      let fin = [];
      masterArr.map(async (e) => {
        let city = e.city;
        let zip = e.zip;
        let street1 = e.street1;
        console.log(city, zip, street1);
        let get = await axios
          .get(
            `http://dev.virtualearth.net/REST/v1/Locations?locality=${city}&postalCode=${zip}&addressLine=${street1}&key=${apiKey}`
          )
          .then((res) => {
            let x = res.data.resourceSets;
            x.forEach((j) => {
              let county = j.resources[0].address.adminDistrict2;
              let newObj = {
                city,
                zip,
                street1,
                county,
              };
              tempArr.push(newObj);
            });
          })
          .catch((err) => {
            console.log({ msg: err.message });
          });
        console.log(tempArr);
      });
    });
};

sortThem();
