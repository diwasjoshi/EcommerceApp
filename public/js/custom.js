$(function() {
    Stripe.setPublishableKey('pk_test_XXXXXXXXXX');    //to be replaced by correct stripe publishable key

  $('#search').keyup(function() {

    var search_term = $(this).val();

    $.ajax({
      method: 'GET',
      url: '/api/search',
      data: {
        search_term
      },
      dataType: 'json',
      success: function(json) {
        var data = json.hits.hits.map(function(hit) {
          return hit;
        });


        $('#searchResults').empty();
        for (var i = 0; i < data.length; i++) {
          var html = "";
          html += '<div class="col-md-4">';
          html += '<a href="/product/' + data[i]._source._id + '">';
          html += '<div class="thumbnail">';
          html += '<img src="' +  data[i]._source.image + '">';
          html += '<div class="caption">';
          html += '<h3>' + data[i]._source.name  + '</h3>';
          html += '<p>' +  data[i]._source.category.name  + '</h3>'
          html += '<p>$' +  data[i]._source.price  + '</p>';
          html += '</div></div></a></div>';

          $('#searchResults').append(html);
        }

      },

      error: function(error) {
        console.log(err);
      }
    });
  });

  $(document).on('click', '#plus, #minus', function(e) {
    e.preventDefault();
    var quantity = parseInt($('#quantity').val());
    quantity += parseInt($(this).attr('data-value'));
    quantity = quantity < 1 ? 1 : quantity;

    var priceValue = parseFloat($('#priceHidden').val()) * quantity;
    $('#quantity').val(quantity);
    $('#priceValue').val(priceValue.toFixed(2));
    $('#total').html(quantity);
  });

  function stripeResponseHandler(status, response) {
    var $form = $('#payment-form');

    if (response.error) {
      $form.find('.payment-errors').text(response.error.message);
      $form.find('button').prop('disabled', false);
    } else {
      var token = response.id;

      $form.append($('<input type="hidden" name="stripeToken" />').val(token));
      $form.get(0).submit();
    }
  };


  $('#payment-form').submit(function(event) {
    var $form = $(this);
    $form.find('button').prop('disabled', true);

    Stripe.card.createToken($form, stripeResponseHandler);
    return false;
  });
});
