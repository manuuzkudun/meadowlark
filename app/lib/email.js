var nodemailer = require('nodemailer'); 

module.exports = function(credentials){
  
  // Create a new email service using Gmail credentials
  var mailTransport = nodemailer.createTransport('SMTP',{
    service: 'Gmail',
    auth: {
      user: credentials.gmail.user,
      pass: credentials.gmail.password,
    } 
  });
  
  // Set from header 
  var from = '"Meadowlark Travel" <info@meadowlarktravel.com>';
  // 
  var errorRecipient = 'youremail@gmail.com';

  return {
    //  Method to send an email
    send: function(to, subj, body){
                   
      mailTransport.sendMail({
        from: from,
        to: to,
        subject: subj,
        html: body, 
        generateTextFromHtml: true
      }, function(err){
        if(err) console.error('Unable to send email: ' + err);
      });
    },
    
    // Method to send an error email
    emailError: function(message, filename, exception){
      
      // Ser message body
      var body = '<h1>Meadowlark Travel Site Error</h1>' +
               'message:<br><pre>' + message + '</pre><br>';
    
      if(exception) body += 'exception:<br><pre>' + exception + '</pre><br>';
    
      if(filename) body += 'filename:<br><pre>' + filename + '</pre><br>';
    
      // Send email
      mailTransport.sendMail({
        from: from,
        to: errorRecipient,
        subject: 'Meadowlark Travel Site Error', 
        html: body, 
        generateTextFromHtml: true
      }, function(err){
        if(err) console.error('Unable to send email: ' + err);
      });
  
    }
  };

};