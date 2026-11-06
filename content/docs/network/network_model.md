+++
date = '2026-11-06T23:11:52+08:00'
title = '网络模型'
+++

<table>
  <thead>
    <tr>
      <th>TCP/IP 四层模型</th>
      <th>OSI 参考模型</th>
      <th>典型协议 / 标准 / 编码</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">应用层</td>
      <td>应用层（Application Layer）</td>
      <td>HTTP、HTTPS、FTP、SMTP、DNS、DHCP、SSH 等</td>
    </tr>
    <tr>
      <td>表示层（Presentation Layer）</td>
      <td>ASCII、JPEG、MPEG 等；TLS/SSL（通常视为表示层或独立安全子层）</td>
    </tr>
    <tr>
      <td>会话层（Session Layer）</td>
      <td>RPC 等</td>
    </tr>
    <tr>
      <td>传输层</td>
      <td>传输层（Transport Layer）</td>
      <td>TCP、UDP 等</td>
    </tr>
    <tr>
      <td>网络层</td>
      <td>网络层（Network Layer）</td>
      <td>IP、ICMP 等</td>
    </tr>
    <tr>
      <td rowspan="2">网络接口层</td>
      <td>数据链路层（Data Link Layer）</td>
      <td>PPP、ARP（跨网络层与链路层）、IEEE 802.3（兼跨物理层）等</td>
    </tr>
    <tr>
      <td>物理层（Physical Layer）</td>
      <td>EIA/TIA-232（RS-232C）、IEEE 802.3（兼跨数据链路层）等</td>
    </tr>
  </tbody>
</table>

> 部分协议本身跨层：IEEE 802.3 同时涉及物理层和数据链路层，ARP 位于网络层与链路层之间，TLS/SSL 位于传输层与应用层之间。
