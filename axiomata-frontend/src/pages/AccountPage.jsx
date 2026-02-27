import { useState, useEffect } from "react";
import { getCurrentUser, updateUser, deleteUser } from "../services/userService";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { logout } = useAuth();
  const [user, setUser] = useState({ username: "", password: "" });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // -------------------- Toast Helper --------------------
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  // -------------------- Fetch Current User --------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser({ username: data.username, password: "" }); // only username
      } catch {
        showToast("Failed to load user info", "error");
      }
    };
    fetchUser();
  }, []);

  // -------------------- Save Updates --------------------
  const handleSave = async () => {
    if (user.password && user.password !== passwordConfirm) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      await updateUser({ username: user.username, password: user.password || undefined });
      showToast("Account updated", "success");
      setUser({ ...user, password: "" });
      setPasswordConfirm("");
      setEditing(false);
    } catch {
      showToast("Failed to update account", "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Delete Account --------------------
  const handleDelete = () => setConfirmOpen(true);

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    setDeleting(true);
    try {
      await deleteUser();       // Actually call API to delete
      showToast("Account deleted", "success");
      logout();                 // Clear token
      window.location.href = "/"; // Redirect home
    } catch {
      showToast("Failed to delete account", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Account Page</h1>
      <p className="page-description">Manage your account information here.</p>

      {/* -------------------- Username / Password Form -------------------- */}
      <div className="form-container">
        <div className="form-field">
          <label>Username</label>
          <input
            type="text"
            value={user.username}
            disabled={!editing}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </div>

        {editing && (
          <>
            <div className="form-field">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>

            <div className="form-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="form-actions">
          {!editing ? (
            <button type="button" onClick={() => setEditing(true)}>Edit</button>
          ) : (
            <>
              <button type="button" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setUser({ ...user, password: "" });
                  setPasswordConfirm("");
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* -------------------- Advanced Settings -------------------- */}
      <div className="advanced-settings">
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="advanced-toggle"
        >
          Advanced Settings {advancedOpen ? "▲" : "▼"}
        </button>

        {advancedOpen && (
          <div className="advanced-content">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="delete-button"
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        )}
      </div>

      {/* -------------------- Confirm Modal -------------------- */}
      <ConfirmModal
        open={confirmOpen}
        message="Are you sure you want to delete your account? This cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* -------------------- Toasts -------------------- */}
      <div className="toasts-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>
    </div>
  );
}