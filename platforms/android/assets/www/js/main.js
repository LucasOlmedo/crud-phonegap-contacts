var db = window.openDatabase(
    'DB',
    '1.0',
    'contacts database',
    2 * 1024 * 1024
)

function createDB(db) {
    db.executeSql('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name VARCHAR(500), phone NUM(11) )')
}

function successCreateDB() {}

function errorCreateDB(error) {
    console.log('DB Error: ' + error)
}

var controller = {

    new: function (element1, element2, form, data) {

        function newContactSuccess() {
            form.trigger('reset')
            element1.hide()
            element2.show()
            controller.refreshView()
        }

        function newContactFail(error) {
            console.log('Insert error: '+ error)
        }

        function newContact(db){
            db.executeSql('INSERT INTO contacts (name, phone) VALUES ("'+ data.name +'", "'+ data.phone +'")')
        }

        db.transaction(newContact, newContactFail, newContactSuccess)
    },

    edit: function (element1, element2, data) {

        function updateContactSuccess() {
            element1.hide()
            element2.show()
            controller.refreshView()
        }

        function updateContactFail(error) {
            console.log('Update error: '+ error)
        }

        function updateContact(db){
            db.executeSql('UPDATE contacts SET name = "' + data.name + '", phone = "' + data.phone + '" WHERE id = '+ data.id)
        }

        db.transaction(updateContact, updateContactFail, updateContactSuccess)
    },

    view: function(id){

        function getContactSuccess(db, result) {
            var contactInfo = $('#contact-info'),
                contact = result.rows.item(0)
            contactInfo.find('.name').html('')
            contactInfo.find('.name').html(contact.name)
            contactInfo.find('.phone').html('')
            contactInfo.find('.phone').html(contact.phone)
        }

        function getContactError(error) {
            console.log('Refresh error: '+ error)
        }

        function getContact(db) {
            db.executeSql('SELECT * FROM contacts WHERE id = '+id, [], getContactSuccess, getContactError)
        }

        db.transaction(getContact)
    },

    remove: function (id) {
        function removeSuccess() {
            controller.refreshView()
        }

        function removeError(error) {
            console.log('Delete error: '+ error)
        }

        function removeContact(db) {
            db.executeSql('DELETE FROM contacts WHERE id = ' + id)
        }

        db.transaction(removeContact, removeError, removeSuccess)
    },

    all: function () {
        controller.refreshView()
    },

    refreshView: function () {
        function selectAllSuccess(db, result) {
            var table = $('.list-contacts'),
                content = '',
                length = result.rows.length

            for (var index = 0; index < length; index++){
                var contact = result.rows.item(index)
                content += '<tr data-row="'+ contact.id +'">'+ 
                                '<td>'+ contact.name +'</td>' +
                                '<td>'+
                                    '<button class="btn btn-info view-contact">'+
                                        '<i class="fas fa-eye"></i>'+
                                    '</button>' +
                                    '&nbsp;' +
                                    '<button class="btn btn-warning edit-contact">'+
                                        '<i class="fas fa-edit"></i>' +
                                    '</button>' +
                                    '&nbsp;' +
                                    '<button class="btn btn-danger remove-contact">' +
                                        '<i class="fas fa-times"></i>' +
                                    '</button>' +
                                '</td>' +
                            '</tr>'
            }
            table.find('tbody').html('')
            table.find('tbody').html(content)
        }

        function selectAllError(error) {
            console.log('Refresh error: '+ error)
        }

        function selectAllContacts(db) {
            db.executeSql('SELECT * FROM contacts', [], selectAllSuccess, selectAllError)
        }

        db.transaction(selectAllContacts)
    }
}