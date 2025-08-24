import { useRouter } from "next/router";
import { useState, useEffect } from "react";


const donationProjects = [
  { id: 1, img: '/images/E1.png', title: 'FENCING OF PRIMARY SCHOOL', by: 'By Community', value: 45000, goal: 15000, raised: 20840, matching: 30000, matchingUsed: 10000, spent: 15454 },
        { id: 2, img: '/images/E2.png', title: 'PROJECT TITLE 2', by: 'By Another Community', value: 30000, goal: 10000, raised: 15000, matching: 15000, matchingUsed: 5000, spent: 8000 },
        { id: 3, img: '/images/E3.png', title: 'PROJECT TITLE 3', by: 'By Some Organization', value: 25000, goal: 8000, raised: 10000, matching: 15000, matchingUsed: 8000, spent: 5000 },
        { id: 4, img: '/images/E4.png', title: 'FENCING OF PRIMARY SCHOOL', by: 'By Community', value: 4500, goal: 1500, raised: 2840, matching: 3000, matchingUsed: 1000, spent: 1454 },
        { id: 5, img: '/images/E5.png', title: 'PROJECT TITLE 2', by: 'By Another Community', value: 3000, goal: 1000, raised: 1500, matching: 1000, matchingUsed: 600, spent: 800 },
        { id: 6, img: '/images/E6.png', title: 'PROJECT TITLE 3', by: 'By Some Organization', value: 25000, goal: 8000, raised: 10000, matching: 15000, matchingUsed: 8000, spent: 5000 },
        { id: 7, img: '/images/E7.png', title: 'COMMUNITY WATER SUPPLY', by: 'By Local Group', value: 50000, goal: 20000, raised: 25000, matching: 20000, matchingUsed: 12000, spent: 18000 },
        { id: 8, img: '/images/E8.png', title: 'VILLAGE ROAD REPAIR', by: 'By Municipality', value: 60000, goal: 25000, raised: 27000, matching: 20000, matchingUsed: 15000, spent: 23000 },
        { id: 9, img: '/images/E9.png', title: 'SOLAR PANEL INSTALLATION', by: 'By Environmental Group', value: 55000, goal: 18000, raised: 19000, matching: 25000, matchingUsed: 14000, spent: 17000 },
        { id: 10, img: '/images/E10.png', title: 'COMMUNITY LIBRARY', by: 'By Education Initiative', value: 40000, goal: 15000, raised: 16000, matching: 15000, matchingUsed: 8000, spent: 12000 },
        { id: 11, img: '/images/E11.png', title: 'PUBLIC PARK RENOVATION', by: 'By Local Residents', value: 45000, goal: 20000, raised: 19000, matching: 20000, matchingUsed: 9000, spent: 16000 },
        { id: 12, img: '/images/E12.png', title: 'FLOOD RELIEF SUPPORT', by: 'By Humanitarian Aid', value: 70000, goal: 30000, raised: 32000, matching: 35000, matchingUsed: 20000, spent: 25000 },

];

const Donate = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState(""); // Default amount in input
  const [paymentMethod, setPaymentMethod] = useState("");
  const [subMethod, setSubMethod] = useState("");
  const methods =["mobile", "bank", "card"];

  useEffect(() => {
    if (id) {
      const selectedProject = donationProjects.find((p) => p.id === parseInt(id));
      setProject(selectedProject || null);
    }
  }, [id]);

  if (!project) {
    return <div className="text-center py-5 text-muted">Loading project details...</div>;
  }

  return (
    <div className="container d-flex justify-content-center pt-5 mt-5 pb-5">
      <div className="border rounded  p-4 col-lg-8 col-12 mt-4" >
        <div className=" text-align-center   row  ">
        <div  className=" col-lg-4 col-12  ">
        <img
            src={project.img}
            alt={project.title}
            className="rounded "
            style={{ objectFit: 'cover', height:"90%" , width:"100%" }} 
          />
        </div>
       
        <div className="fw-bold col-lg-8 col-12   " >
        <p className="text-muted"> You’re supporting <span className="font fw-bold">{project.title}</span>.</p>
        <p> Your support will make differnce!</p>
       
        </div>
        </div>

        {/*Amount of donation */}
        <h5 className="mt-3 fw-bold">Enter Your Donation</h5>
       
        <div className="container px-3">
  <div className="row g-2 flex-wrap">
    <button
      className={`btnAmount  col-md-4 col-lg-4 p-2 p-lg-4 ${selectedAmount === 5 ? "btn-success" : "btn-outline-success"}`}
      onClick={() => {
        setSelectedAmount(5);
        setCustomAmount(5);
      }}
    >
      $5
    </button>
    <button
      className={`btnAmount  col-md-4 col-lg-4 p-2 p-lg-4 ${selectedAmount === 10 ? "btn-success" : "btn-outline-success"}`}
      onClick={() => {
        setSelectedAmount(10);
        setCustomAmount(10);
      }}
    >
      $10
    </button>
    <button
      className={`btnAmount  col-md-4 col-lg-4 p-2 p-lg-4 ${selectedAmount === 50 ? "btn-success" : "btn-outline-success"}`}
      onClick={() => {
        setSelectedAmount(50);
        setCustomAmount(50);
      }}
    >
      $50
    </button>
  </div>

  <div className="pt-3 row g-2 flex-wrap">
    <button
      className={`btnAmount col-md-4 col-lg-4 p-2 p-lg-4 ${selectedAmount === 100 ? "btn-success" : "btn-outline-success"}`}
      onClick={() => {
        setSelectedAmount(100);
        setCustomAmount(100);
      }}
    >
      $100
    </button>
    <button
      className={`btnAmount  col-md-4 col-lg-4 p-2 p-lg-4 ${selectedAmount === 500 ? "btn-success" : "btn-outline-success"}`}
      onClick={() => {
        setSelectedAmount(500);
        setCustomAmount(500);
      }}
    >
      $500
    </button>
    <button
      className={`btnAmount  col-md-4 col-lg-4 p-2 p-lg-4 ${selectedAmount === 1000 ? "btn-success" : "btn-outline-success"}`}
      onClick={() => {
        setSelectedAmount(1000);
        setCustomAmount(1000);
      }}
    >
      $1000
    </button>
  </div>
</div>


        {/* Custom Amount Input */}
        <div className="mt-3">
          <input
            type="text"
            className="form-control p-3 "
            placeholder="Enter amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
          />
        </div>

        {/* Payment  */}
        <h5 className="mt-4 fw-bold">Payment Method</h5>
        <div className="container ">
          {methods.map((method) => (
            <div className="border rounded  p-3">
            <div className="form-check " key={method}>
              <input
                className="form-check-input "
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={() => {
                  setPaymentMethod(method);
                  setSubMethod(""); // Reset sub-method when switching
                }}
              />
              <label className="form-check-label">
                {method === "mobile" ? "Mobile Money" : method === "bank" ? "Bank Transfer" : "Credit/Debit Card"}
              </label>
            </div>
            </div>
          ))}
          
        </div>

        {/* Sub-options for Payment Methods */}
        {paymentMethod === "mobile" && (
          <div className="mt-3 ">
            <h6>Mobile Transfer</h6>
           <div className="container row gap-2">
            <button
            key="Telesom Zaad"
              className={`btnType col-5  p-2 p-lg-4 ${subMethod === "Telesom Zaad" ? "btn-info" : "btn-outline-info"}`}
              onClick={() => setSubMethod("Telesom Zaad")}
            >
              Telesom Zaad
            </button>
            <button
            key="Edahab"
              className={`btnType col-5  p-2 p-lg-4 ${subMethod === "Edahab" ? "btn-info" : "btn-outline-info"}`}
              onClick={() => setSubMethod("TEdahab")}
            >
              Edahab
            </button>
            </div>
          </div>
        )}

        {paymentMethod === "bank" && (
          <div className="mt-3">
            <h6>Banks</h6>
            <div className="container row gap-2">
            <button
              className={`btnType col-5  p-2 p-lg-4 ${subMethod === "Dahabshiil" ? "btn-info" : "btn-outline-info"}`}
              onClick={() => setSubMethod("Dahabshiil")}
            >
              Dahabshiil
            </button>
            <button
              className={`btnType  col-5  p-2 p-lg-4 ${subMethod === "Dara Salam" ? "btn-info" : "btn-outline-info"}`}
              onClick={() => setSubMethod("Dara Salam")}
            >
              Dara Salam
            </button>
          </div>
          </div>
        )}

        {paymentMethod === "card" && (
          <div className="mt-3">
            <h6>Cards</h6>
            <div className="container row gap-2">
          <button 
           key="Visa"
           className={`btnType col-5  p-2 p-lg-4 ${subMethod === "Visa" ? "btn-info" : "btn-outline-info"}`}
           onClick={() => setSubMethod("Visa")}
          >
           Visa
          </button>
          {/* Master Card */}
          <button 
           key="Master Card"
           className={`btnType col-5 p-2 p-lg-4 ${subMethod === "Master Card" ? "btn-info" : "btn-outline-info"}`}
           onClick={() => setSubMethod("Master Card")}
          >
           Master Card
          </button>
          
          </div>
          </div>
        )}

        {/* Donate Button */}
        <div className="mt-4">
          <button className="btnActions2  w-100 fw-bold  d-block w-100 px-4 py-2 mt-2 mb-3 text-white fw-bold">Donate Now</button>
        </div>

        <p className="text-center mt-3 text-muted pb-5">Thank you for joining and helping the community in need.</p>
      </div>
    </div>
  );
};

export default Donate;
