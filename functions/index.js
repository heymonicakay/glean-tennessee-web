const Functions = require('firebase-functions')
const Admin = require('firebase-admin')
const SendGrid = require('@sendgrid/mail')

Admin.initializeApp(Functions.config().firebase)

SendGrid.setApiKey(Functions.config().sendgrid.key)

exports.sendMessage = Functions.https.onCall((data, context) => {
  const name = context.auth.token.name || null;
  const email = context.auth.token.email || null;
  const {details, subject, phone, address} = data
  const emailConfig = {
    to: 'corey@codefornashville.org',
    from: email,
    subject,
    templateId: 'd-b1f6d9ac6715453d9c7ba5b3edfbe6a2',
    substitutionWrappers: ['{{', '}}'],
    substitutions: {
      name: name,
      message: details, 
      phone,
      address,
    }
  }
  SendGrid.send(emailConfig)
})
