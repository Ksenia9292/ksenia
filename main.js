<script>
        var cartGlobal = {
            init() {
                var $cartCounter = $('header[header-main-navigation] .cart-counter')
                var storageCart = localStorage.getItem('cart');
                var storageCartLength = 0
                if (storageCart) {
                    storageCartLength = JSON.parse(storageCart).length
                }
                if (!storageCart) {
                    $cartCounter.hide()
                    localStorage.setItem('cart', '[]')
                } else if (storageCartLength) {
                    $cartCounter.text(storageCartLength)
                    $cartCounter.show()
                }
                $(document).on('cartChange', function (e, args) {
                    var storageCart = JSON.parse(localStorage.getItem('cart'));
                    switch (args.action) {
                        case 'addItem':
                            var newItem = true
                            if (storageCart.length) {
                                storageCart.forEach(function (item) {
                                    if (item.itemId === args.itemId) {
                                        if (args.amount > 1) {
                                            item.amount = +args.amount
                                        } else if (args.amount === 1) {
                                            item.amount = +item.amount + +args.amount
                                        } else {
                                            item.amount = 1
                                        }
                                        newItem = false
                                    }
                                })
                            }
                            if (newItem) {
                                storageCart.push({ itemId: args.itemId, amount: args.amount })
                            }
                            localStorage.setItem('cart', JSON.stringify(storageCart))
                            $cartCounter.text(storageCart.length)
                            $cartCounter.show()
                            $.cookie('cart', JSON.stringify(storageCart), { expires: 180, path: "/" })
                            break;
                        case 'removeItem':

                            storageCart = storageCart.filter(function (item) {
                                return item.itemId !== args.itemId
                            })
                            localStorage.setItem('cart', JSON.stringify(storageCart))
                            if (storageCart.length) {
                                $cartCounter.text(storageCart.length)
                            } else {
                                $cartCounter.hide()
                                if ($('.cart-table') && $('.cart-form')) {
                                    $('.cart-table').replaceWith('  <div class="d-flex align-items-center justify-content-center" style="min-height: 300px">\n            <h1 class="text-center mt-3 mb-3">Кошик пустий</h1>\n        </div>')
                                    $('.cart-form').remove()
                                }
                            }
                            $.cookie('cart', JSON.stringify(storageCart), { expires: 180, path: "/" })
                            break;
                        case 'clearCart':
                            $.removeCookie('cart', { path: "/" })
                            localStorage.setItem('cart', '[]')
                            break;
                    }
                })
            }
             var header = {
            init() {
                $('.dropdown-menu .submenu .dropdown-toggler').on('click', function (e) {
                    if (!$(this).next().hasClass('show')) {
                        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
                    }
                    var $subMenu = $(this).next(".dropdown-menu");
                    $subMenu.toggleClass('show');


                    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
                        $('.dropdown-submenu .show').removeClass("show");
                    });
                    return false;
                });
            }
        }
          $(document).ready(function () {
            cartGlobal.init()
            header.init()

            quickOrder.init()

            $("footer .scroller").click(function (e) {
                e.preventDefault()
                $("html, body").animate({ scrollTop: 0 }, "slow");
                return false;
            });
        });

        <script>

        var quickOrder = {
            init() {
                var $form = $('.quick-order[quick-order] form')
                var form = document.querySelector('.quick-order[quick-order] form')
                var $name = $form.find('input#name')
                var $phone = $form.find('input[phone]')
                var $feed = $form.find('select[feed]')
                var $submit = $form.find('input[submit]')
                var currentUrl = window.location.href
                var token = $('meta[name=csrf-token]').attr('content')

                $form.find('[phone]').mask('+38 (000) 000-00-00')

                $form.submit(function (event) {
                    event.preventDefault();
                    $name.val($name.val().trim())
                    if (form.checkValidity() === false) {
                        event.stopPropagation();
                    } else {
                        $name.attr('disabled', 'disabled')
                        $phone.attr('disabled', 'disabled')
                        $feed.attr('disabled', 'disabled')
                        $submit.attr('disabled', 'disabled')
                        $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': token } });
                        $.post({
                            url: "/shop/feedback/create_feedback",
                            data: {
                                client_name: $name.val(),
                                client_phone: $phone.val(),
                                from_page: currentUrl,
                                subcategory: $feed.val(),
                            },
                            success: function () {
                                window.location.href = '/feedback/thanks'
                            },
                            complete: function () {
                                $name.removeAttr('disabled')
                                $phone.removeAttr('disabled')
                                $submit.removeAttr('disabled')
                                $feed.removeAttr('disabled')
                            }
                        })
                    }
                    form.classList.add('was-validated')
                })
            }
        }

         var $form = $('footer form')
        var form = document.querySelector('footer form')
        var $email = $form.find('[email]')
        var $submit = $form.find('[submit]')
        var token = $('meta[name=csrf-token]').attr('content')
        var $mailChimpModal = $('footer #toMailchimpModal')

        $form.submit(function (event) {
            event.preventDefault();
            if (form.checkValidity() === false) {
                event.stopPropagation();
            } else {
                $email.attr('disabled', 'disabled')
                $submit.attr('disabled', 'disabled')
                $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': token } });
                $.post({
                    url: "/mailchimp",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({
                        user_email: $email.val(),
                    }),
                    success: function () {
                        $email.val('')
                        $mailChimpModal.modal('show')
                    },
                    complete: function () {
                        $email.removeAttr('disabled')
                        $submit.removeAttr('disabled')
                    }
                })
            }
            form.classList.add('was-validated')
        })
    </script>

        