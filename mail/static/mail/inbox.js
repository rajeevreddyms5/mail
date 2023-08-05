document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#viewemail').style.display = 'none';
  document.querySelector('#alert').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // send button
  document.querySelector('form').onsubmit = function() {
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // send emails through API
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body,
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result to console
        console.log(result);

        // if error display error on the HTML webpage
        if (result.error) {
          document.querySelector('#alert').innerHTML = result.error;
          document.querySelector('#alert').style.display = 'block';
        }
        else {  //if no error then load sent mailbox
          load_mailbox('sent');
        }
    })

    // Stop form from submitting
    return false


  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#viewemail').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //fetch emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

    // ... do something else with emails ...
    emails.forEach((element) =>{
      console.log(element.recipients);
      console.log(element.subject);
      console.log(element.timestamp);

      // sent mailbox
      if (mailbox === 'sent') {
        document.querySelector('.card-body').innerHTML = `<ul>To:${element.recipients} Subject:${element.subject} Date:${element.timestamp} </ul>`;
      }
    });
  
    
});
}