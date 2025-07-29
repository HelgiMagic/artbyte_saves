$(document).on('click', '.select-number-btn-minus', function () {

    let qttyvalue = parseInt($(this).parent().find('.select-number-input').val());

    if (qttyvalue == $(this).parent().find('.select-number-input').attr("data-min")) {

        let that = $(this);

        $.ajax({
            type: "POST",
            url: "/ajax/changebasket.php",
            data: ({
                id: that.parent().find('.select-number-input').attr("data-id"),
                quantity: "0 " + that.parent().find('.select-number-input').attr("data-desc")
            }),
            success: function (basketloader) {
                //$('.item-basket-btn').css("display", "flex");
                //$('.select-number').css("display", "none");
                that.parent().parent().find('.item-basket-btn').css("display", "flex");
                that.parent().parent().find('.select-number').css("display", "none");
            }
        });

        setTimeout(function () {

            if (that.parent().find('input.multiplicity').attr('multiplicity') > 0 && that.parent().find('input.multiplicity').prop('checked') == true) {
                that.parent().find('input.select-number-input').val(that.parent().find('input.multiplicity').attr('multiplicity') + ' шт.');
            } else {
                that.parent().find('input.select-number-input').val('1 шт.');
            }

            $.ajax({
                type: "GET",
                url: "/ajax/smallcart.php",
                success: function (smallbasketloader) {
                    $('#smallcart').html(smallbasketloader);
                }
            });
            
            $.ajax({
                type: "GET",
                url: "/ajax/smallcart2.php",
                success: function (smallbasketloader) {
                    $('#smallcart2').html(smallbasketloader);
                }
            });
        }, 500);

    }
});

$(document).on('click', '.select-number-btn-plus', function () {
    setTimeout(function () {
        $.ajax({
            type: "GET",
            url: "/ajax/smallcart.php",
            success: function (smallbasketloader) {
                $('#smallcart').html(smallbasketloader);
            }
        });
    }, 500);
});