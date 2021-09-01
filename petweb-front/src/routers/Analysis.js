import React, { Component } from "react";
import ReactDOM from "react-dom";
import Slider from "react-slick";
import "../App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { connect } from "react-redux";
import * as actions from "../reduxs/actions";
// import {useSelector, useDispatch} from 'react-redux';
// import {increment, decrement} from '../reduxs/actions';
import IconBurger from "../images/IconBurger";
import CustomSlide from "./components/Slider/CustomSlide";
import AnalysisItem1 from "./components/Items/AnalysisItem1";
import AnalysisItem2 from "./components/Items/AnalysisItem2";
import AnalysisItem3 from "./components/Items/AnalysisItem3";
import axios from "axios";
import * as services from "../services/fetchApi";
import { IPinUSE } from "../services/IPs";
// const subRegionName = [
//     'Frontal_L', 'Frontal_L_C',
//     'Frontal_R', 'Frontal_R_C',
//     'Cingulate_L','Cingulate_L_C',
//     'Cingulate_R','Cingulate_R_C',
//     'Striatum_L','Striatum_L_C',
//     'Striatum_R','Striatum_R_C',
//     'Thalamus_L','Thalamus_L_C',
//     'Thalamus_R','Thalamus_R_C',
//     'Occipital_L','Occipital_L_C',
//     'Occipital_R','Occipital_R_C',
//     'Parietal_L','Parietal_L_C',
//     'Parietal_R','Parietal_R_C',
//     'Temporal_L','Temporal_L_C',
//     'Temporal_R','Temporal_R_C',
//     'Composite', 'Composite_C',]
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

// function Analysis() {
class Analysis extends Component {
  constructor(props) {
    super(props);
    // this.handleWheel = this.handleWheel.bind(this);
    this.state = {
      showMenu: false,
      subRegion: {},
    };
  }

  componentDidUpdate(prevProps) {
    const { counter } = this.props;
    const username = localStorage.getItem("username");
    if (prevProps.counter.tabX != this.props.counter.tabX) {
      // console.log('componentDidUpdate')
      try {
        axios
          .get(
            IPinUSE +
              "result/download/" +
              username +
              "/database/" +
              counter.fileID +
              "/aal_subregion.txt"
          )
          .then((res) => {
            const posts = res.data.split(/\s+/);
            const obj = posts.reduce(function (o, val, idx) {
              o[subRegionName[idx]] = Number(val);
              return o;
            }, {});
            // console.log(res.data,posts, typeof(posts), obj)
            this.setState({
              subRegion: obj,
            });
          });
      } catch (err) {}
    }
  }
  // handleWheel(e) {
  //   e.preventDefault();
  //   // console.log(e.deltaY)
  //   e.deltaY > 0 ? this.slider.slickNext() : this.slider.slickPrev();
  // }
  componentDidMount() {
    const { counter } = this.props;
    const username = localStorage.getItem("username");
    // console.log('componentDidMount')
    try {
      axios
        .get(
          IPinUSE +
            "result/download/" +
            username +
            "/database/" +
            counter.fileID +
            "/aal_subregion.txt"
        )
        .then((res) => {
          const posts = res.data.split(/\s+/);
          const obj = posts.reduce(function (o, val, idx) {
            o[subRegionName[idx]] = Number(val);
            return o;
          }, {});
          // console.log(res.data,posts, typeof(posts), obj)
          this.setState({
            subRegion: obj,
          });
        });
    } catch (err) {}
    // ReactDOM.findDOMNode(this).addEventListener('wheel', this.handleWheel);
  }

  componentWillUnmount() {
    // ReactDOM.findDOMNode(this).removeEventListener('wheel', this.handleWheel);
  }
  reportDownload = async () => {
    const { counter, stackManager, fileList } = this.props;
    const out_suvr_max = fileList.find(v=>v.fileID==counter.fileID).out_suvr_max;
    const out_suvr_min = fileList.find(v=>v.fileID==counter.fileID).out_suvr_min;
    const currentUrl = window.location.href;
    const mainUrl = currentUrl.split("/").slice(0, 3).join("/");
    const reportUrl = mainUrl + "/report/" + counter.fileID;
    // console.log(reportUrl);
    window.open(reportUrl);
  };
  csvDownload = async () => {
    const { counter, stackManager, fileList } = this.props;
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const downloadUrl =
      IPinUSE +
      "result/download/" +
      username +
      "/database/" +
      counter.fileID +
      "/" +
      counter.fileID +
      ".csv";
    setTimeout(() => window.open(downloadUrl, "_blank"), 1000);
  };
  niftiDownload = async () => {
    const { counter, stackManager, fileList } = this.props;
    // console.log('download nifti')
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    // // res = await services.TokenVerify({'token':token})
    // console.log(counter.fileID, fileList)
    const selectedList = fileList.filter((v, i) => v.fileID == counter.fileID);
    // console.log(selectedList.length)
    if (selectedList.length != 0) {
      const res = await services.downloadNifti({
        token: token,
        selectedList: selectedList,
      });
      if (res.status == 200) {
        const downloadUrl =
          IPinUSE +
          "result/download/" +
          username +
          "/downloader/brightonix_imaging.zip";
        setTimeout(() => window.open(downloadUrl, "_blank"), 1000);
      } else {
        alert("Download failed");
      }
    } else {
      alert("No files selected");
    }

    // const {counter, stackManager} = this.props;
    // console.log('download nifti')
    // const token = localStorage.getItem('token')
    // const username = localStorage.getItem('username')
    // const fileID = stackManager?.[counter.tabX].fileID;
    // const downloadUrl = IPinUSE+'result/download/'+username+'/database/'+fileID+"/"+"output_"+fileID+".nii";
    // // // res = await services.TokenVerify({'token':token})
    // // const res = await services.downloadNifti({'token':token});
    // setTimeout(() => window.open(downloadUrl, "_blank"), 1000);
  };
  render() {
    const { subRegion } = this.state;
    const { niftiDownload, csvDownload, reportDownload } = this;
    // console.log('state: ', subRegion)
    const {
      counter,
      isLogged,
      increment,
      decrement,
      listSelected,
      stackManager,
    } = this.props;
    // const counter = useSelector(state => state.counter);
    // const isLogged = useSelector(state => state.isLogged);
    // const dispatch = useDispatch();
    // const [showMenu, setShowMenu] = useState(false)
    // console.log(history.location.pathname)
    const settings = {
      className: "center",
      centerMode: true,
      dots: true,
      infinite: false,
      vertical: true,
      verticalSwiping: true,
      speed: 300,
      slidesToShow: 1,
      centerPadding: "50px",
      slidesToScroll: 1,
      accessibility: false,
    };
    return (
      <div
        className="content"
        onClick={() => this.setState({ showMenu: false })}
      >
        {/* <Sidebar/>
        <Headerbar/> */}
        <div className="content-page">
          <div className="analysis-box">
            {/* <Slider ref={slider => this.slider = slider} {...settings} > */}
            {/* <CustomSlide index={1}> */}
            <div
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                margin: "0px 0px 15px",
              }}
            >
              <div className="analysis-box1">
                <div className="analysis-box1-title">Regional SUVR</div>
                <AnalysisItem1 subRegion={subRegion} />
              </div>

              <div className="analysis-box2">
                <div className="analysis-box2-title">
                  Sub-regional SUVR and Centiloid
                </div>
                <AnalysisItem2 subRegion={subRegion} />
              </div>
            </div>
            {/* </CustomSlide>
              <CustomSlide index={2}> */}
            <div
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                margin: "0px 0px 15px",
              }}
            >
              <div className="analysis-box3">
                <div className="analysis-box3-title">Brain Surface</div>
                <AnalysisItem3 />
              </div>
            </div>
            {/* </CustomSlide> */}
            {/* </Slider> */}
          </div>

          <div className="content-title">
            <div className="content-info" style={{ border: "0px red solid" }}>
              <div
                style={{
                  marginRight: "10px",
                  maxWidth: "1200px",
                  height: "60px",
                }}
              >
                Patient Name
                <div className="content-var">
                  {stackManager?.[counter.tabX].PatientName}
                </div>
              </div>
              <div style={{ margin: "0px 10px" }}>
                Patient ID
                <div className="content-var">
                  {stackManager?.[counter.tabX].PatientID}
                </div>
              </div>
              <div style={{ margin: "0px 10px" }}>
                Birth Date
                <div className="content-var">
                  {stackManager?.[counter.tabX].Age}
                </div>
              </div>
              <div style={{ margin: "0px 10px" }}>
                Sex
                <div className="content-var">
                  {stackManager?.[counter.tabX].Sex}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", color: "white" }}>
              <div
                className="view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  this.setState({ showMenu: !this.state.showMenu });
                }}
              >
                <IconBurger
                  className={`view-icon ${this.state.showMenu && "show"}`}
                />
                {this.state.showMenu && (
                  <div
                    className="view-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div onClick={niftiDownload}>Export Nifti</div>
                    <div onClick={csvDownload}>Export as CSV</div>
                    <div onClick={reportDownload}>Export Report</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* <div className="redux-info">
            <h1>isLogged: {isLogged.toString()}</h1>
            <h1>Analysis page</h1>
            <h1>listSelected: {listSelected}</h1>
            <h1>Counter: {counter}</h1>
            <button onClick={()=> increment()}>+</button>
            <button onClick={()=> decrement()}>-</button>
          </div> */}
          {/* {isLogged ? '' : <h3>Valueable Information I shouldn't see</h3>} */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // storeCount: state.count.count,
  counter: state.counter,
  isLogged: state.isLogged,
  stackManager: state.stackManager,
  fileList: state.fileList,
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(actions.increment()),
  decrement: () => dispatch(actions.decrement()),
  login: () => dispatch(actions.login()),
  logout: () => dispatch(actions.logout()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Analysis);
