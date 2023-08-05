document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //clear list
  document.getElementById("emails-view").innerHTML = "";

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
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
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //clear list
  document.getElementById("emails-view").innerHTML = "";
  
  //fetch emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

    // ... do something else with emails ...
    //make the list item
    let listItem = document.createElement('p');

    // select list id from html
    mylist = document.querySelector('#emails-view');

    if (emails.length === 0) {
      listItem.innerHTML = `<div class="alert alert-danger" role="alert">No Emails in your ${mailbox.toUpperCase()}</div>`; 
      mylist = document.querySelector('#emails-view');
      mylist.append(listItem);
    }

    // calculate no. of mails
    let numberOfListItems = emails.length;

    //iterate over each email
    for(let i = 0; i < numberOfListItems; ++i) {
      listItem.innerHTML = `<div class="card"> <div class="card-body">To:${emails[i].recipients} Subject:${emails[i].subject} Date:${emails[i].timestamp} </div></div>`;
      mylist.append(listItem); // add list item to list element
      listItem = document.createElement('p'); // reset the list item
    }
 
});

}