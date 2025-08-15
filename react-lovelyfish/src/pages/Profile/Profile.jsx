import React, { useState, useEffect } from "react";
import api from "../../API/axios";
import { useUser } from "../../contexts/UserContext";
import "./Profile.css";

export default function ProfilePage() {
  const { user, logout, updateUser } = useUser();
  //console.log("User from context:", user);

  // 控制修改密码表单显示/隐藏
  const [showChangePwdForm, setShowChangePwdForm] = useState(false);

  // 修改密码相关状态
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePwdMessage, setChangePwdMessage] = useState(null);
  const [changePwdError, setChangePwdError] = useState(null);
  const [loadingChangePwd, setLoadingChangePwd] = useState(false);

  // 用户资料表单状态
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

   // 初始化表单
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  //提示框3s后自动消失
  useEffect(() => {
    if (changePwdMessage || changePwdError) {
      const timer = setTimeout(() => {
        setChangePwdMessage(null);
        setChangePwdError(null);
        setProfileMessage(null);
        setProfileError(null);
      }, 3000); // 3秒后消失
      return () => clearTimeout(timer);
    }
  }, [changePwdMessage, changePwdError, profileMessage, profileError]);
  

  // 处理修改密码
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Clear password
    setChangePwdMessage(null);
    setChangePwdError(null);

    // Check the new password and confirm one
    if (newPassword !== confirmNewPassword) {
      setChangePwdError("新密码和确认密码不一致");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setChangePwdError(
        "密码必须至少8位，包含大写字母、小写字母、数字和特殊字符"
      );
      return;
    }

    setLoadingChangePwd(true);

    try {
      await api.post("/account/change-password", {
        oldPassword,
        newPassword,
      });
      setChangePwdMessage("密码修改成功");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowChangePwdForm(false);
    } catch (err) {
      setChangePwdError(err.response?.data?.message || "修改密码失败");
    } finally {
      setLoadingChangePwd(false);
    }
  };

  // 处理更新资料
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    if (!name || !phone || !address) {
      setProfileError("姓名、电话和地址不能为空");
      return;
    }

    setLoadingProfile(true);
    try {
      await api.post("/account/update-profile", { name, phone, address });
      setProfileMessage("资料更新成功");
      updateUser(); // 刷新 UserContext
    } catch (err) {
      setProfileError(err.response?.data?.message || "资料更新失败");
    } finally {
      setLoadingProfile(false);
    }
  };


  return (
    <div className="profile-container">

      <h2>个人资料</h2>

      <div className="profile-info">
        <form onSubmit={handleUpdateProfile} className="profile-form" autoComplete="off">
          {profileMessage && <div className="alert alert-success">{profileMessage}</div>}
          {profileError && <div className="alert alert-danger">{profileError}</div>}

          <div className="profile-field">
            <p><strong>邮箱：</strong>{user?.email || "加载中..."}</p>
          </div>

          <div className="profile-field">
            <label>姓名</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="profile-field">
            <label>电话</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="profile-field">
            <label>地址</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>

          <button type="submit" disabled={loadingProfile}>
            {loadingProfile ? "保存中..." : "保存资料"}
          </button>
        </form>


        <section className="change-password-section">
          <button
            className="toggle-password-btn"
            onClick={() => setShowChangePwdForm(!showChangePwdForm)}
          >
            {showChangePwdForm ? "取消修改密码" : "修改密码"}
          </button>

          
          {/* 成功提示  */}
          {changePwdMessage && (
            <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
              {changePwdMessage}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}
          {/* 错误提示 */}
          {changePwdError && (
            <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
              {changePwdError}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}

          {showChangePwdForm && (
          <>
            <form
              onSubmit={handleChangePassword}
              className="change-password-form"
              autoComplete="off"
            >
              <div className="password-requirements">
                密码要求：至少8位，包含大写字母、小写字母、数字和特殊字符
              </div>
              <input
                type="password"
                placeholder="当前密码"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="新密码"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="确认新密码"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              <button
                className="change-password-button"
                type="submit"
                disabled={loadingChangePwd}
              >
                {loadingChangePwd ? "提交中..." : "提交修改"}
              </button>
            </form>
          </>
          )}
        </section>
      </div>

      <button className="logout-button" onClick={logout}>
        退出登录
      </button>
    </div>
  );
}


// 邮箱不可修改（注册时固定）

// 姓名、电话、地址可编辑

// 点击“保存资料”调用 /account/update-profile

// 调用 updateUser() 后，UserContext 立即刷新

// 修改密码功能保留
