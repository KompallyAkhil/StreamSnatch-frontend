import "./Navbar.css"
import { useState } from "react"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Details from "./Details/Details";
import Footer from "./Footer/Footer";
import Header from "./Header";
import Spinner from "./Spinner";
const Navbar = () => {
    const [link, FinalLink] = useState("")
    const [Type, setType] = useState("")
    const [Urlvideo, setUrlvideo] = useState()
    const [error,seterror] = useState(false);
    const [linkerror,setlinkerror] = useState(false)
    const [spinner,setspinner] = useState(false)
    function ChangeType(e) {
        setType(e.target.value)
    }
    function ChangeLink(e) {
        FinalLink(e.target.value)
    }
    async function DownloadInsta() {
        try {
            const response = await axios.get(`https://stream-snatch-backend.vercel.app/download-instagram-video?url=${link}`)
            setUrlvideo(response.data.videoUrl)
            setlinkerror(false)
            setspinner(false)
        } catch (error) {
            toast.warn("Invalid URL");
            setlinkerror(true);
            return;
        }
        finally{
            setlinkerror(false)
            setspinner(false)
        }
    }
    async function DownloadFacebook() {
        try {
            const response = await axios.get(`https://stream-snatch-backend.vercel.app/download-fb-video?url=${link}`);
            setUrlvideo(response.data.videoUrl);
            setlinkerror(false)
            setspinner(false)
        } catch (error) {
            toast.warn("Invalid URL");
            setlinkerror(true);
            return;
        }
        finally{
            setspinner(false)
        }
    }
    function Convert(event) {
        if(!link){
            toast.warn("Url cannot be empty")
            event.preventDefault();
            setspinner(false)
            seterror(true);
            return;
        }
        if (!Type) {
            toast.warn("Select a Stream");
            event.preventDefault();
            seterror(true);
            setspinner(false)
            return;
        } 
        else{
            setspinner(true)
            if (Type === "Instagram") {
                DownloadInsta();
            } else if (Type === "Facebook") {
                DownloadFacebook();
            }
            seterror(false)
            return;
        }
    }
    const Enter = (e) =>{
        if (e.key === "Enter"){
            Convert()
        }
    }
    async function VideoDownload() {
        try {
            let result = await fetch(Urlvideo);
            let file = await result.blob()
            let tempUrl = URL.createObjectURL(file);
            let anchorTag = document.createElement("a");
            let filename = "download"
            anchorTag.href = tempUrl;
            anchorTag.download = filename;
            document.body.appendChild(anchorTag);
            anchorTag.click();
            anchorTag.remove();
            URL.revokeObjectURL(tempUrl)
        } catch (error) {
            console.log("Error while downloading")
        }
    }

    
    return (
        <>
            <Header/>
            <div className="main-bg">
                <div className="main-outside">
                    <div className="main-inside">
                        <h1>Instagram and FB Downloader</h1>
                        <p>Download reels, videos from Instagram and Facebook</p>
                        <div class="input-outer">
                            <div class="input-container">
                                <input type="text" placeholder="Insert link here" onKeyDown={Enter} value={link} onChange={ChangeLink} id="instagram-link" />    
                                <select value={Type} onChange={ChangeType} className="paste-btn">
                                    <option value="">Select</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Facebook">Facebook</option>
                                </select>
                                <button class="download-btn" onClick={Convert}>Convert</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" pauseOnFocusLoss draggable autoClose={5000} pauseOnHover />
            {error && seterror}
            {linkerror && setlinkerror}
            {spinner && <Spinner/>}
            {Urlvideo && (
                <div className="video-container">
                    <h1 className="video-heading">Video Preview</h1>
                    <video controls src={Urlvideo} type="video/mp4" height={500} width={700} style={{border:"none"}} />
                    <button className="download-button" onClick={VideoDownload}>Download</button>  
                </div>
            )}
            <Details/>
            <Footer/>

        </>
    )
}
export default Navbar