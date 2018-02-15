var app = {

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready')
        db.transaction(createDB, errorCreateDB, successCreateDB)

        $('form[data-action="new-contact"]').on('submit', function (e) {
            var $this = $(this)
            e.preventDefault()
            app.formSubmit($this)
        })

        $('.list-contacts').on('click', '.remove-contact', function (e) {
            var element = $(this)
            var remove = confirm('Are you sure?')
            if(remove == true){
                app.removeContact(element)
            }else{
                e.preventDefault()
            }
        })

        $('.list-contacts').on('click', '.edit-contact', function (e) {
            var element = $(this)
            var form = $('form[data-action="edit-contact"]')
            $('#main-screen').hide()
            $('#edit-screen').show()
            
            app.renderEditContact(element, form)

            $('#edit-screen').on('click', '.btn-back', function () {
                $('#edit-screen').hide()
                $('#main-screen').show()
            })
        })

        $('form[data-action="edit-contact"]').on('submit', function (e) {
            var $this = $(this)
            e.preventDefault()
            app.formSubmit($this)
        })

        $('.list-contacts').on('click', '.view-contact', function (e) {
            var element = $(this)
            $('#main-screen').hide()
            $('#view-screen').show()
            
            app.viewContact(element)

            $('#view-screen').on('click', '.btn-back', function () {
                $('#view-screen').hide()
                $('#main-screen').show()
            })
        })

        controller.all()
    },

    receivedEvent: function(id) {
        // console.log('Received Event: ' + id)
    },

    formSubmit: function (formElement) {
        var form = formElement
        var action = form.data('action')
        switch (action) {
            case 'new-contact':
                var data = {
                    name: form.find('input[name="name"]').val(),
                    phone: form.find('input[name="phone"]').val(),
                }
                controller.new(form, data)
                break;
            case 'edit-contact':
                var data = {
                    id: form.find('input[name="id"]').val(),
                    name: form.find('input[name="name"]').val(),
                    phone: form.find('input[name="phone"]').val(),
                }
                controller.edit($('#edit-screen'), $('#main-screen'), data)
                break;
            default:
                alert('Invalid Action!')
                break;
        }
    },

    removeContact: function (element) {
        var row = element.closest('tr').data('row')
        controller.remove(row)
    },

    viewContact: function (element) {
        var row = element.closest('tr').data('row')
        controller.view(row)
    },

    renderEditContact: function (element, form) {
        var row = element.closest('tr').data('row')
        
        function getByIdError(error) {
            console.log('Error: '+ error)
        }

        function getByIdSuccess(db, result) {
            var contact = result.rows.item(0)

            form.find('input[name="id"]').val(contact.id)
            form.find('input[name="name"]').val(contact.name)
            form.find('input[name="phone"]').val(contact.phone)
        }

        function getById(db) {
            db.executeSql('SELECT * FROM contacts WHERE id = ' + row, [], getByIdSuccess, getByIdError)
        }

        db.transaction(getById)
    }
};

app.initialize()