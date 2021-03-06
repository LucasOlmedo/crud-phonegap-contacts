var controller = {

    new: function (element1, element2, form, data) {

        // function newContactSuccess() {
        //     form.trigger('reset')
        //     element1.hide()
        //     element2.show()
        //     controller.refreshView()
        // }

        // function newContactFail(error) {
        //     console.log('Insert error: '+ error)
        // }

        // function newContact(db){
        //     db.executeSql('INSERT INTO contacts (name, phone) VALUES ("'+ data.name +'", "'+ data.phone +'")')
        // }

        // db.transaction(newContact, newContactFail, newContactSuccess)
    },

    edit: function (element1, element2, data) {

        // function updateContactSuccess() {
        //     element1.hide()
        //     element2.show()
        //     controller.refreshView()
        // }

        // function updateContactFail(error) {
        //     console.log('Update error: '+ error)
        // }

        // function updateContact(db){
        //     db.executeSql('UPDATE contacts SET name = "' + data.name + '", phone = "' + data.phone + '" WHERE id = '+ data.id)
        // }

        // db.transaction(updateContact, updateContactFail, updateContactSuccess)
    },

    view: function(contact){

        var name = contact.data('name'),
            phones = JSON.parse(JSON.stringify(contact.data('phones'))),
            emails = JSON.parse(JSON.stringify(contact.data('emails'))),
            addresses = JSON.parse(JSON.stringify(contact.data('addresses'))),
            photos = JSON.parse(JSON.stringify(contact.data('photos'))),
            contactInfo = $('#contact-info')

        if(name != null){
            contactInfo.find('.contact-name').html('')
            contactInfo.find('.contact-name').html(name)
        }

        if (photos == null) {
            contactInfo.find('.contact-photo').attr('src', 'img/contact-default.png')
        }else{
            contactInfo.find('.contact-photo').attr('src', photos[0].value)
        }

        if (phones != null) {
            var phonesContent = '<small><strong>Phones</strong></small>'+
                                    '<hr><ul class="list-unstyled">'

            for (var index = 0; index < phones.length; index++) {
                var phone = phones[index]
                phonesContent += '<li>'+
                                    '<i class="fas fa-phone text-success"></i> &nbsp;&nbsp;' + 
                                    phone.value + 
                                '</li>'
            }
            phonesContent += '</ul>'
            contactInfo.find('.contact-phones').html(phonesContent)
        }else{
            contactInfo.find('.contact-phones').html('')
        }

        if (emails != null) {
            var emailsContent = '<small><strong>Emails</strong></small>'+
                                    '<hr><ul class="list-unstyled">'

            for (var index = 0; index < emails.length; index++) {
                var email = emails[index]
                emailsContent += '<li>'+
                                    '<i class="fas fa-envelope text-muted"></i> &nbsp;&nbsp;' + 
                                    email.value +
                                '</li>'
            }
            emailsContent += '</ul>'
            contactInfo.find('.contact-emails').html(emailsContent)
        }else{
            contactInfo.find('.contact-emails').html('')
        }

        if (addresses != null) {
            var addressesContent = '<small><strong>Addresses</strong></small>'+
                                    '<hr><ul class="list-unstyled">'

            for (var index = 0; index < addresses.length; index++) {
                var address = addresses[index]
                addressesContent += '<li>'+
                                    '<i class="fas fa-map-marker text-primary"></i> &nbsp;&nbsp;' + 
                                    address.formatted + 
                                '</li>'
            }
            addressesContent += '</ul>'
            contactInfo.find('.contact-addresses').html(addressesContent)
        }else{
            contactInfo.find('.contact-addresses').html('')
        }
    },

    remove: function (id) {
        // function removeSuccess() {
        //     controller.refreshView()
        // }

        // function removeError(error) {
        //     console.log('Delete error: '+ error)
        // }

        // function removeContact(db) {
        //     db.executeSql('DELETE FROM contacts WHERE id = ' + id)
        // }

        // db.transaction(removeContact, removeError, removeSuccess)
    },

    all: function () {
        controller.refreshView()
    },

    refreshView: function () {
        var options = new ContactFindOptions()

        options.multiple = true
        options.desiredFields = [
            navigator.contacts.fieldType.id,
            navigator.contacts.fieldType.name,
            navigator.contacts.fieldType.phoneNumbers,
            navigator.contacts.fieldType.emails,
            navigator.contacts.fieldType.addresses,
            navigator.contacts.fieldType.photos,
        ]
        options.hasPhoneNumber = true

        var fields = [
            navigator.contacts.fieldType.name,
            navigator.contacts.fieldType.phoneNumbers,
            navigator.contacts.fieldType.emails,
            navigator.contacts.fieldType.addresses,
            navigator.contacts.fieldType.photos,
        ]

        navigator.contacts.find(fields, onSuccess, onError, options)

        function onError(error) {
            alert('An unexpected error occurred! '+ error)
        }

        function onSuccess(result) {
            var list = $('.list-contacts'),
                content = '',
                length = result.length,
                letter = result[0].name.formatted[0]
            
            result.sort(controller.alphabeticalSort)

            for (var index = 0; index < length; index++){
                var contact = result[index],
                    contactPhoto = ''

                if (contact.photos == null) {
                    contactPhoto = '<img src="img/contact-default.png" class="rounded-circle" width="50">'
                }else{
                    contactPhoto = '<img src="'+ contact.photos[0].value +'" class="rounded-circle" width="50">'
                }

                if(contact.name){
                    if( letter !== contact.name.formatted[0] ) {
                        letter = contact.name.formatted[0] 
                        content += '<div class="list-divider">'+ 
                                        '<br>' +
                                        '<h5><strong>' + letter + '</strong></h5>'+
                                        '<br>' +
                                    '</div>'
                    }
                    
                    content += "<button class='btn btn-light list-group-item view-contact' data-row='"+ contact.id +"'>" + 
                                    "<div class='contact-data' data-name='" + contact.name.formatted + 
                                        "' data-phones='"+ JSON.stringify(contact.phoneNumbers) + 
                                        "' data-emails='"+ JSON.stringify(contact.emails) + 
                                        "' data-addresses='"+ JSON.stringify(contact.addresses) +
                                        "' data-photos='"+ JSON.stringify(contact.photos) +"'></div>" +
                                    '<div class="float-left">' +
                                        contactPhoto +
                                        '<span class="ml-2">'+ 
                                            contact.name.formatted +
                                        '</span>'+
                                    '</div>' +
                               '</button>'
                }

            }
            list.find('.list-group').html('')
            list.find('.list-group').html(content)
        }
    },

    alphabeticalSort: function (a, b) {
        if (a.name.formatted < b.name.formatted){
            return -1;
        }else if (a.name.formatted > b.name.formatted){
            return  1;
        }else{
            return 0;
        }
    }
}