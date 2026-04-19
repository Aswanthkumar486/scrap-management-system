function Navbar() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            Sri Periyandavar Steel & Scrap
          </span>
  
          <div>
            <button className="btn btn-outline-danger">
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }
  
  export default Navbar;