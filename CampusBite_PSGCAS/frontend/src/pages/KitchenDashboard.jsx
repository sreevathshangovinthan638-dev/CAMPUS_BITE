import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUtensils,
  FaClock,
  FaCheckCircle,
  FaFire,
  FaSync,
  FaArrowRight,
  FaBell,
} from "react-icons/fa";
import { INITIAL_KITCHEN_ORDERS } from "../api/mockData";

export default function KitchenDashboard() {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("campusbite_kitchen_live");
    return saved ? JSON.parse(saved) : INITIAL_KITCHEN_ORDERS;
  });

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'preparing' | 'ready'

  const counts = useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === "pending").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
    };
  }, [orders]);

  const updateStatus = (orderId, newStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("campusbite_kitchen_live", JSON.stringify(updated));
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  return (
    <div className="kitchen-page-replica">
      <div className="kitchen-container">
        {/* Header (Screen 14) */}
        <div className="kitchen-header-row">
          <div className="kitchen-title-box">
            <h2>Kitchen Dashboard</h2>
            <p>Live Orders from CampusBite • Real-time KDS</p>
          </div>
          <div className="live-pulse-badge">
            <span className="live-dot"></span> Live Kitchen Queue
          </div>
        </div>

        {/* Status Filter Tabs with Counts (Screen 14 Replica) */}
        <div className="kitchen-status-tabs">
          <button
            className={`tab-pill ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Live Orders ({orders.length})
          </button>
          <button
            className={`tab-pill pending-pill ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending ({counts.pending})
          </button>
          <button
            className={`tab-pill prep-pill ${activeTab === "preparing" ? "active" : ""}`}
            onClick={() => setActiveTab("preparing")}
          >
            Preparing ({counts.preparing})
          </button>
          <button
            className={`tab-pill ready-pill ${activeTab === "ready" ? "active" : ""}`}
            onClick={() => setActiveTab("ready")}
          >
            Ready ({counts.ready})
          </button>
        </div>

        {/* Live Orders Table (Screen 14 Replica) */}
        <div className="kitchen-table-card">
          <table className="kds-table">
            <thead>
              <tr>
                <th className="th-hash">#</th>
                <th className="th-item">Item & Customer</th>
                <th className="th-time">Time</th>
                <th className="th-status">Status</th>
                <th className="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isNew = order.status === "pending";
                const isPrep = order.status === "preparing";
                const isReady = order.status === "ready";

                return (
                  <tr key={order.id} className={`kds-row ${order.status}`}>
                    <td className="td-hash">
                      <strong>{order.orderNum || order.id}</strong>
                    </td>
                    <td className="td-item">
                      <div className="item-title-row">
                        <strong>{order.item}</strong>
                        {order.qty > 1 && <span className="qty-tag">x{order.qty}</span>}
                      </div>
                      <small className="cust-name">For: {order.customer}</small>
                    </td>
                    <td className="td-time">
                      <span className="time-badge"><FaClock /> {order.time}</span>
                    </td>
                    <td className="td-status">
                      <span className={`kds-status-tag ${order.status}`}>
                        {isNew ? "New" : isPrep ? "Preparing" : isReady ? "Ready" : order.status}
                      </span>
                    </td>
                    <td className="td-action">
                      {isNew && (
                        <button
                          className="kds-btn start-prep"
                          onClick={() => updateStatus(order.id, "preparing")}
                        >
                          <FaFire /> Start Prep
                        </button>
                      )}
                      {isPrep && (
                        <button
                          className="kds-btn mark-ready"
                          onClick={() => updateStatus(order.id, "ready")}
                        >
                          <FaCheckCircle /> Mark Ready
                        </button>
                      )}
                      {isReady && (
                        <button
                          className="kds-btn collect"
                          onClick={() => updateStatus(order.id, "collected")}
                        >
                          Collected
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
