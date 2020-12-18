<form method="post" action="https://getform.io/{your-unique-getform-endpoint}">
  ...
  <label>
    Email
    <input type="email" name="email" />
  </label>
  <label>
    Name
    <input type="text" name="name" />
  </label>
  <label>
    Message
    <input type="text" name="message" />
  </label>
  ...
</form>
- <form method="post" action="#">
+ <form method="post" netlify-honeypot="bot-field" data-netlify="true" name="contact">
+   <input type="hidden" name="bot-field" />
+   <input type="hidden" name="form-name" value="contact" />
  ...
