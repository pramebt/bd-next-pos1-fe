import Modal from "../components/Mymodal";

const Page = () => {
  return (
    <div>
      <div className="card mt-3">
        <div className="card-header">รสชาติอาหาร</div>
        <div className="card-body">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalTaste"
          >
            <i className="fa fa-plus me-2"></i> เพิ่มรสชาติอาหาร
          </button>
        </div>
      </div>
      <Modal id="modalTaste" title="รสชาติอาหาร">
        <div>ประเภทอาหาร</div>
        <select className="form-control">
          <option></option>
        </select>
        <div className="mt-3">ชื่อ</div>
        <input className="form-control" />

        <div className="mt-3">หมายเหตุ</div>
        <input className="form-control" />

        <button className="mt-3 btn btn-primary">
          <i className="fa fa-check me-2"></i>บันทึก
        </button>
        
      </Modal>
    </div>
  );
};

export default Page;
