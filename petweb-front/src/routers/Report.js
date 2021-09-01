import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../App.css";
import ReportBar from "./components/Charts/ReportBar";
import { Colorscale } from "react-colorscales";
import { Rotate } from "hammerjs";
import Pdf from "react-to-pdf";
import { exportComponentAsJPEG } from "react-component-export-image";
import ColorscalePicker from "react-colorscales";
import axios from "axios";
// import * as services from "../services/fetchApi";
import { IPinUSE } from "../services/IPs";

const subRegionName = [
  "Frontal_L",
  "Frontal_L_C",
  "Frontal_R",
  "Frontal_R_C",
  "Precuneus_PCC_L",
  "Precuneus_PCC_L_C",
  "Precuneus_PCC_R",
  "Precuneus_PCC_R_C",
  "Lateral_temporal_L",
  "Lateral_temporal_L_C",
  "Lateral_temporal_R",
  "Lateral_temporal_R_C",
  "Parietal_L",
  "Parietal_L_C",
  "Parietal_R",
  "Parietal_R_C",
  "Occipital_L",
  "Occipital_L_C",
  "Occipital_R",
  "Occipital_R_C",
  "Medial_temporal_L",
  "Medial_temporal_L_C",
  "Medial_temporal_R",
  "Medial_temporal_R_C",
  "Basal_ganglia_L",
  "Basal_ganglia_L_C",
  "Basal_ganglia_R",
  "Basal_ganglia_R_C",
  "Global",
  "Global_C",
  "Centiloid_Composite",
  "Centiloid_Composite_C",
];

let colormap = require("colormap");

let colors = colormap({
  colormap: "jet",
  nshades: 100,
  format: "hex",
  alpha: 1,
});
const idx = Array.from(Array(100).keys());
const viridisColorscale = idx.map((v) => colors[v]);

const ref = React.createRef();

function Report({ history, location }) {
  // const counter = useSelector((state) => state.counter);
  // console.log("Hello!", counter, stackManager);
  const [subRegion, setSubRegion] = useState({});

  const fileID = location.pathname.split("/")[2];
  // const out_suvr_max = location.pathname.split("/")[3];
  const username = localStorage.getItem("username");

  const fileList = useSelector((state) => state.fileList);
  console.log(fileList);
  const out_suvr_max = fileList.find((v) => v.fileID == fileID)?.out_suvr_max;
  const PatientID = fileList.find((v) => v.fileID == fileID)?.PatientID;
  const PatientName = fileList.find((v) => v.fileID == fileID)?.PatientName;
  const Gender = fileList.find((v) => v.fileID == fileID)?.Sex;
  const BirthDate = fileList.find((v) => v.fileID == fileID)?.Age;
  const StudyDate = fileList.find(
    (v) => v.fileID == fileID
  )?.AcquisitionDateTime;
  const StudyDescription = fileList.find((v) => v.fileID == fileID)?.Tracer;
  // console.log(PatientID, PatientName, Gender, BirthDate, StudyDate);
  // console.log("hello: ", fileList);

  useEffect(() => {
    try {
      axios
        .get(
          IPinUSE +
            "result/download/" +
            username +
            "/database/" +
            fileID +
            "/aal_subregion.txt"
        )
        .then((res) => {
          const posts = res.data.split(/\s+/);
          const obj = posts.reduce(function (o, val, idx) {
            o[subRegionName[idx]] = Number(val);
            return o;
          }, {});
          // this.setState({
          //   subRegion: obj,
          // });
          setSubRegion(obj);
        });
    } catch (err) {}
  }, []);

  // console.log(username)
  // console.log(fileID)
  // console.log(subRegion)1
  var today = new Date();
  var date1 =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const date = new Date(today);
  /* Date format you have */
  const dateMDY = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  /* Date converted to MM-DD-YYYY format */
  console.log(dateMDY, date1);

  return (
    <div
      style={{
        // border: "3px red solid",
        // marginLeft: "250px",
        // marginTop: "50px",
        width: "100vw",
        boxSizig: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        overflow: "auto",
      }}
    >
      <div
        ref={ref}
        style={{
          width: `calc(595px + 200px)`,
          height: `calc(842px + 200px)`,
          // border: "3px red solid",
          background: "white",
          boxSizing: "border-box",
          padding: "47px 57px",
          // display:"flex",
          fontSize: "11px",
        }}
      >
        <div
          style={{
            border: "0px red solid",
            color: "black",
            height: "42px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: "24px", fontWeight: "500" }}>
            <span style={{ color: "#014CA3", fontWeight: "bold" }}>
              BRIGHTONIX
            </span>{" "}
            <span>IMAGING</span>
          </div>
          <div style={{ border: "0px red solid" }}>
            <div
              style={{
                textAlign: "right",
                fontSize: "17px",
                fontWeight: "600",
                fontStyle: "normal",
              }}
            >
              <span style={{ color: "#014CA3" }}>BTXBrain</span>
              &nbsp;&nbsp;
              <span style={{ fontWeight: "normal" }}>
                Quantification Report
              </span>
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: "17px",
                fontWeight: "normal",
              }}
            >
              <span>{dateMDY}</span>
            </div>
          </div>
        </div>
        <div
          style={{ border: "0px red solid", color: "black", height: "92px" }}
        >
          <div>
            <div
              style={{
                display: "flex",
                textAlign: "left",
                fontSize: "15px",
                color: "#014CA3",
                fontWeight: "800",
                fontStyle: "bold",
              }}
            >
              <span>Patient Information</span>
              <div
                style={{
                  borderBottom: "1.5px solid #014CA3",
                  flexGrow: "1",
                  height: "14px",
                  marginLeft: "8px",
                }}
              ></div>
            </div>
            <div
              style={{
                border: "0px red solid",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "normal",
                color: "#292D30",
                marginTop: "1px",
              }}
            >
              <table
                border="0"
                cellspacing="0"
                cellpadding="0"
                style={{ textAlign: "left", fontSize: "13px" }}
              >
                <tr>
                  <td style={{ fontWeight: "500", paddingRight: "20px" }}>
                    <span>Patient ID</span>
                  </td>
                  <td>
                    <span>{PatientID}</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "500", paddingRight: "20px" }}>
                    <span>Date of birth</span>
                  </td>
                  <td>
                    <span>{BirthDate}</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "500", paddingRight: "20px" }}>
                    <span>Study date</span>
                  </td>
                  <td>
                    <span>{StudyDate}</span>
                  </td>
                </tr>
              </table>
              <table
                border="0"
                cellspacing="5"
                cellpadding="0"
                style={{ textAlign: "left", fontSize: "13px" }}
              >
                <tr>
                  <td style={{ fontWeight: "500", paddingRight: "20px" }}>
                    <span>Name</span>
                  </td>
                  <td>
                    <span>{PatientName}</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "500", paddingRight: "20px" }}>
                    <span>Gender</span>
                  </td>
                  <td>
                    <span>{Gender}</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "500", paddingRight: "20px" }}>
                    <span>Study description</span>
                  </td>
                  <td>
                    <span>{StudyDescription}</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div
          style={{
            // border: "2px red solid",
            color: "black",
            height: `calc(277px + 145px)`,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                textAlign: "left",
                fontSize: "14px",
                color: "#014CA3",
                fontWeight: "800",
                fontStyle: "bold",
              }}
            >
              <span>Amyloid PET Images</span>
              <div
                style={{
                  borderBottom: "1.5px solid #014CA3",
                  flexGrow: "1",
                  height: "14px",
                  marginLeft: "8px",
                }}
              ></div>
            </div>
            <div
              style={{
                // alignSelf: "center",
                display: "grid",
                gridTemplateColumns: "0.6fr 0.6fr 0.6fr 0.6fr 0.2fr",
                gridTemplateRows: "1fr 1fr 1fr ",
                gridTemplateAreas: `'im11 im12 im13 im14 cmap' 'im21 im22 im23 im24 cmap' 'im31 im32 im33 im34 cmap'`,
                // border: "4px red solid",
                marginTop: "10px",
                marginLeft: "50px",
                // height: "130px",
                width: `calc(450px + 100px)`,
                // alignItems: "center",
                justifyItems: "center",
                // border:
              }}
            >
              <div
                style={{
                  gridArea: "cmap",
                  // border: "4px red solid",
                  width: "30px",
                  // transform: "rotate(90deg)",
                  // background: "red",
                  // display: "flex",
                  // alignItems:"center",
                }}
              >
                <div style={{ marginLeft: "10px", fontWeight: "bold" }}>
                  <div>{out_suvr_max}</div>
                </div>
                <div
                  style={{
                    float: "right",
                    borderRadius: "40px",
                    marginTop: "-10px",
                    transform: "rotate(-90deg)",
                    transformOrigin: "bottom right",
                    width: "250px",
                    height: "20px",
                    // border: "1px black solid",
                    overflow: "hidden",
                    userSelect: "none",
                    // marginTop: "20px",
                  }}
                >
                  <Colorscale
                    colorscale={viridisColorscale}
                    onClick={() => {}}
                    width={70}
                  />
                </div>
                <div
                  style={{
                    marginTop: "270px",
                    marginLeft: "10px",
                    fontWeight: "bold",
                  }}
                >
                  <div>0</div>
                  <br />
                  <div style={{ marginLeft: "-4px" }}>SUVR</div>
                </div>
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im11",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "0px transparent",
                }}
              >
                <img
                  style={{ border: "0px transparent", height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_17.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im12",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "0px transparent",
                }}
              >
                <img
                  style={{ border: "0px transparent", height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_22.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im13",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_27.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im14",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_32.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im21",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_37.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im22",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_41.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im23",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_46.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im24",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_51.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im31",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_56.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im32",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_61.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im33",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_66.png"
                  }
                />
              </div>
              <div
                style={{
                  overflow: "hidden",
                  width: "100%",
                  gridArea: "im34",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{ height: "120%" }}
                  src={
                    IPinUSE +
                    "result/download/" +
                    username +
                    "/database/" +
                    fileID +
                    "/output_axial_71.png"
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            border: "0px red solid",
            color: "black",
            height: "200px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                textAlign: "left",
                fontSize: "14px",
                color: "#014CA3",
                fontWeight: "800",
                fontStyle: "bold",
                // border: "1px red solid",
                marginBottom: "20px",
              }}
            >
              <span>Quantification Results</span>
              <div
                style={{
                  borderBottom: "1.5px solid #014CA3",
                  flexGrow: "1",
                  height: "14px",
                  marginLeft: "8px",
                }}
              ></div>
            </div>
            <div style={{ border: "0px red solid", paddingLeft: "20px" }}>
              <ReportBar
                Global={subRegion?.Global?.toFixed(2)}
                Frontal={(
                  (subRegion?.Frontal_L + subRegion?.Frontal_R) /
                  2
                ).toFixed(2)}
                Precuneus_PCC={(
                  (subRegion?.Precuneus_PCC_L + subRegion?.Precuneus_PCC_R) /
                  2
                ).toFixed(2)}
                Parietal={(
                  (subRegion?.Parietal_L + subRegion?.Parietal_R) /
                  2
                ).toFixed(2)}
                Lateral_temporal={(
                  (subRegion?.Lateral_temporal_L +
                    subRegion?.Lateral_temporal_R) /
                  2
                ).toFixed(2)}
                Medial_temporal={(
                  (subRegion?.Medial_temporal_L +
                    subRegion?.Medial_temporal_R) /
                  2
                ).toFixed(2)}
                Occipital={(
                  (subRegion?.Occipital_L + subRegion?.Occipital_R) /
                  2
                ).toFixed(2)}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            border: "1px white solid",
            color: "black",
            height: "200px",
          }}
        >
          <table
            // border="1"
            cellspacing="0"
            // cellpadding="0"
            style={{
              textAlign: "center",
              width: "100%",
              height: "100%",
              borderBottom: "1px black solid",
              borderRadius: "5px 5px 0 0",
              overflow: "hidden",
              borderCollapse: "collapse",
            }}
          >
            <tr
              style={{
                backgroundColor: "#014CA3",
                color: "white",
              }}
            >
              <th style={{ borderRight: "0.5px dashed #666", width: "120px" }}>
                &nbsp;
              </th>
              <th
                colspan="3"
                style={{
                  borderRight: "0.5px dotted #666",
                  fontWeight: "500",
                }}
              >
                SUVR
              </th>
              <th colspan="3" style={{ fontWeight: "500" }}>
                Centiloid
              </th>
            </tr>
            <tr
              style={{
                backgroundColor: "#014CA3",
                color: "white",
              }}
            >
              <th style={{ borderRight: "0.5px dashed #666" }}>&nbsp;</th>
              <th style={{ fontWeight: "500" }}>Total</th>
              <th style={{ fontWeight: "500" }}>Left</th>
              <th
                style={{
                  borderRight: "0.5px dotted #666",
                  fontWeight: "500",
                }}
              >
                Right
              </th>
              <th style={{ fontWeight: "500" }}>Total</th>
              <th style={{ fontWeight: "500" }}>Left</th>
              <th style={{ fontWeight: "500" }}>Right</th>
            </tr>
            <tr
              style={{
                borderBottom: "0.5px solid #CCCCCC",
              }}
            >
              <td
                style={{
                  backgroundColor: "#C4C4C4",
                  textAlign: "left",
                  paddingLeft: "20px",
                  fontWeight: "500",
                }}
              >
                Global
              </td>
              <td>{subRegion?.Global?.toFixed(2)}</td>
              <td>-</td>
              <td>-</td>
              <td>{subRegion?.Global_C?.toFixed(2)}</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr
              style={{
                borderBottom: "0.5px solid #CCCCCC",
              }}
            >
              <td
                style={{
                  backgroundColor: "#C4C4C4",
                  textAlign: "left",
                  paddingLeft: "20px",
                  fontWeight: "500",
                }}
              >
                Frontal
              </td>
              <td>
                {((subRegion?.Frontal_L + subRegion?.Frontal_R) / 2)?.toFixed(
                  2
                )}
              </td>
              <td>{subRegion?.Frontal_L?.toFixed(2)}</td>
              <td>{subRegion?.Frontal_R?.toFixed(2)}</td>
              <td>
                {(
                  (subRegion?.Frontal_L_C + subRegion?.Frontal_R_C) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Frontal_L_C?.toFixed(2)}</td>
              <td>{subRegion?.Frontal_R_C?.toFixed(2)}</td>
            </tr>
            <tr
              style={{
                borderBottom: "0.5px solid #CCCCCC",
              }}
            >
              <td
                style={{
                  backgroundColor: "#C4C4C4",
                  textAlign: "left",
                  paddingLeft: "20px",
                  fontWeight: "500",
                }}
              >
                Precuneus-PCC
              </td>
              <td>
                {(
                  (subRegion?.Precuneus_PCC_L + subRegion?.Precuneus_PCC_R) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Precuneus_PCC_L?.toFixed(2)}</td>
              <td>{subRegion?.Precuneus_PCC_R?.toFixed(2)}</td>
              <td>
                {(
                  (subRegion?.Precuneus_PCC_L_C +
                    subRegion?.Precuneus_PCC_R_C) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Precuneus_PCC_L_C?.toFixed(2)}</td>
              <td>{subRegion?.Precuneus_PCC_R_C?.toFixed(2)}</td>
            </tr>
            <tr
              style={{
                borderBottom: "0.5px solid #CCCCCC",
              }}
            >
              <td
                style={{
                  backgroundColor: "#C4C4C4",
                  textAlign: "left",
                  paddingLeft: "20px",
                  fontWeight: "500",
                }}
              >
                Parietal
              </td>
              <td>
                {((subRegion?.Parietal_L + subRegion?.Parietal_R) / 2)?.toFixed(
                  2
                )}
              </td>
              <td>{subRegion?.Parietal_L?.toFixed(2)}</td>
              <td>{subRegion?.Parietal_R?.toFixed(2)}</td>
              <td>
                {(
                  (subRegion?.Parietal_L_C + subRegion?.Parietal_R_C) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Parietal_L_C?.toFixed(2)}</td>
              <td>{subRegion?.Parietal_R_C?.toFixed(2)}</td>
            </tr>
            <tr
              style={{
                borderBottom: "0.5px solid #CCCCCC",
              }}
            >
              <td
                style={{
                  backgroundColor: "#C4C4C4",
                  textAlign: "left",
                  paddingLeft: "20px",
                  fontWeight: "500",
                }}
              >
                Lateral temporal
              </td>
              <td>
                {(
                  (subRegion?.Lateral_temporal_L +
                    subRegion?.Lateral_temporal_R) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Lateral_temporal_L?.toFixed(2)}</td>
              <td>{subRegion?.Lateral_temporal_R?.toFixed(2)}</td>
              <td>
                {(
                  (subRegion?.Lateral_temporal_L_C +
                    subRegion?.Lateral_temporal_R_C) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Lateral_temporal_L_C?.toFixed(2)}</td>
              <td>{subRegion?.Lateral_temporal_R_C?.toFixed(2)}</td>
            </tr>
            <tr
              style={{
                borderBottom: "0.5px solid #CCCCCC",
              }}
            >
              <td
                style={{
                  backgroundColor: "#C4C4C4",
                  textAlign: "left",
                  paddingLeft: "20px",
                  fontWeight: "500",
                }}
              >
                Medial temporal
              </td>
              <td>
                {(
                  (subRegion?.Medial_temporal_L +
                    subRegion?.Medial_temporal_R) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Medial_temporal_L?.toFixed(2)}</td>
              <td>{subRegion?.Medial_temporal_R?.toFixed(2)}</td>
              <td>
                {(
                  (subRegion?.Medial_temporal_L_C +
                    subRegion?.Medial_temporal_R_C) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Medial_temporal_L_C?.toFixed(2)}</td>
              <td>{subRegion?.Medial_temporal_R_C?.toFixed(2)}</td>
            </tr>
            <tr>
              <td
                style={{
                  backgroundColor: "#C4C4C4",
                  textAlign: "left",
                  paddingLeft: "20px",
                  fontWeight: "500",
                }}
              >
                Occipital
              </td>
              <td>
                {(
                  (subRegion?.Occipital_L + subRegion?.Occipital_R) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Occipital_L?.toFixed(2)}</td>
              <td>{subRegion?.Occipital_R?.toFixed(2)}</td>
              <td>
                {(
                  (subRegion?.Occipital_L_C + subRegion?.Occipital_R_C) /
                  2
                )?.toFixed(2)}
              </td>
              <td>{subRegion?.Occipital_L_C?.toFixed(2)}</td>
              <td>{subRegion?.Occipital_R_C?.toFixed(2)}</td>
            </tr>
          </table>
        </div>
      </div>
      {/* <div style={{alignSelf:"center", margin:"10px"}}>
        <Pdf targetRef={ref} filename="brightonix.pdf" options={{
          unit: 'px',
        }}>
          {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
        </Pdf>
      </div> */}
      <div
        style={{
          alignSelf: "center",
          margin: "10px",
          height: "40px",
          border: "0px red solid",
          display: "flex",
        }}
      >
        <button
          style={{ backgroundColor: "#118AF7", border: "0px", color: "white" }}
          onClick={() => exportComponentAsJPEG(ref, "brightonix")}
        >
          Export As JPEG
        </button>
      </div>
    </div>
  );
}

export default Report;
