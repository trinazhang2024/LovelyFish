import React from 'react';
import './About.css'; // 引入样式文件

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">关于我们</h1>

      {/* 公司简介 */}
      <section className="about-section">
        <h2 className="section-title">公司简介</h2>
        <p className="section-content">
          我们是一家专注于渔具设计与制造的公司，致力于为全球钓鱼爱好者提供高品质的渔具产品。我们的产品涵盖渔竿、渔轮、鱼线、鱼饵等，深受广大用户的喜爱。
        </p>
      </section>

      {/* 使命与愿景 */}
      <section className="about-section">
        <h2 className="section-title">使命与愿景</h2>
        <p className="section-content">
          我们的使命是通过创新的设计和卓越的品质，提升每一位钓鱼爱好者的垂钓体验。我们的愿景是成为全球领先的渔具品牌，推动钓鱼文化的传播与发展。
        </p>
      </section>

      {/* 团队成员 */}
      <section className="about-section">
        <h2 className="section-title">我们的团队</h2>
        <div className="team-members">
          <div className="team-member">
            <img
              src="/assets/images/team-member-1.jpg" // 团队成员图片路径
              alt="团队成员 1"
              className="member-photo"
            />
            <h3 className="member-name">张三</h3>
            <p className="member-role">首席执行官</p>
          </div>
          <div className="team-member">
            <img
              src="/assets/images/team-member-2.jpg" // 团队成员图片路径
              alt="团队成员 2"
              className="member-photo"
            />
            <h3 className="member-name">李四</h3>
            <p className="member-role">首席设计师</p>
          </div>
          <div className="team-member">
            <img
              src="/assets/images/team-member-3.jpg" // 团队成员图片路径
              alt="团队成员 3"
              className="member-photo"
            />
            <h3 className="member-name">王五</h3>
            <p className="member-role">市场总监</p>
          </div>
        </div>
      </section>

      {/* 联系我们 */}
      <section className="about-section">
        <h2 className="section-title">联系我们</h2>
        <p className="section-content">
          如果您有任何问题或建议，欢迎随时联系我们：
        </p>
        <ul className="contact-list">
          <li>电话: +86 123 4567 890</li>
          <li>邮箱: info@lovelyfish.com</li>
          <li>地址: 中国北京市朝阳区渔具大道 123 号</li>
        </ul>
      </section>
    </div>
  );
};

export default About;