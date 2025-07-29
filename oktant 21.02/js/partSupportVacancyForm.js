$(function () {
    $(document).on('click', '.jsSubmit', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $form = $this.closest('form');
        var formUrl = $form.attr('action');

        $.ajax({
            url:formUrl,
            method: 'post',
            type: "POST",             // Type of request to be send, called as method
            data: new FormData($form.get(0)), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData:false,        // To send DOMDocument or non processed data file it is set to false

            dataType:'json',
            success: function (res) {
                console.log('ok');
                console.log(res);
                if(res.msg) {
                    //alert(res.msg);
                    $('#modal-sent .modal-title').text( res.msg );
                    openModal('#modal-sent');
                }
                
                if (res.hasError) {
                    
                } else {
                    $form.find('input, textarea').val('');
                    $('.ctrFiles').html('');
                }
            },
            error: function (p1, p2, p3) {
                console.log(p1);
                console.log(p2);
                console.log(p3);
            }
        });

        return false;
    });


    $(document).on('change', '.file', function (event) {
      var t = $(this),
          label = t.closest('.file-label'),
          info = label.find('.file-label-info'),
          fileName = '';

      if (t.hasClass('input-user-img')) {
        if (t[0].files) {
          var file = t[0].files[0];
          var type = file.type;
          var validTypes = ['image/png', 'image/jpeg', 'image/gif'];
          var reader = new FileReader();
          var valid = validTypes.some(function (el) {
            return el == type;
          });

          if (!valid) {
            label.removeClass('active');
            return;
          }

          reader.readAsDataURL(file);

          reader.onload = function () {
            label.find('.file-user-img-upload').html('');
            var img = '<img src="' + reader.result + '" alt="">';
            label.find('.file-user-img-upload').append(img);
            label.addClass('active');
          };
        } else {
          label.removeClass('active');
          return;
        }
      }

      if (label.hasClass('file-label-multiple')) {
          
        if (!t[0].files) return;
        fileName = event.target.value.split('\\').pop();
        var clone_file_wrap = 
                '<label class="file-label file-label-multiple disabled">'
                    +'<span class="file-label-info"><span>' + fileName + '</span><a href="#" class="file-del"></a></span>'
                    //+ $(this).clone().attr('id', 'att_'+Date.now()).attr('name', 'attach[]')
                +'</label>';
                
                 //'<input type="file" id="vacfile_'+Date.now()+'" name="attach[]" class="file">'
        t.closest('.form-block').find('.files_list').append( 
            $(clone_file_wrap).append( 
                t.clone().attr('id', 'att_'+Date.now()).attr('name', 'attach[]') 
            ) 
        );       
        return;
      }

      if (t[0].files && t[0].files.length > 1) {
        fileName = t[0].files.length + ' files';
      } else {
        fileName = event.target.value.split('\\').pop();
      }

      if (fileName) {
        info.text(fileName);
      } else {
        info.text('');
      }
    });
    $(document).on('click', '.file-del', function () {
      var label = $(this).closest('.file-label');
      label.addClass('del');
      setTimeout(function () {
        label.remove();
      }, 400);
      return false;
    });


});



