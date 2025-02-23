import ActiveAdmin from './active_admin';

ActiveAdmin.modal_dialog = function(message, inputs, callback){
  let html = `<form id="dialog_confirm" title="${message}"><ul>`;
  for (let name in inputs) {
    var elem, opts, wrapper;
    let type = inputs[name];
    if (/^(datepicker|checkbox|text|number)$/.test(type)) {
      wrapper = 'input';
    } else if (type === 'textarea') {
      wrapper = 'textarea';
    } else if ($.isArray(type)) {
      [wrapper, elem, opts, type] = ['select', 'option', type, ''];
    } else {
      throw new Error(`Unsupported input type: {${name}: ${type}}`);
    }

    let klass = type === 'datepicker' ? type : '';
    html += `<li>
      <label>${name.charAt(0).toUpperCase() + name.slice(1)}</label>
      <${wrapper} name="${name}" class="${klass}" type="${type}">` +
        (opts ? ((() => {
          const result = [];

          opts.forEach(v => {
            const $elem = $(`<${elem}/>`);
            if ($.isArray(v)) {
              $elem.text(v[0]).val(v[1]);
            } else {
              $elem.text(v);
            }
            result.push($elem.wrap('<div>').parent().html());
          });

          return result;
        })()).join('') : '') +
      `</${wrapper}>` +
    "</li>";
    [wrapper, elem, opts, type, klass] = []; // unset any temporary variables
  }

  html += "</ul></form>";

  const form = $(html).appendTo('body');
  $('body').trigger('modal_dialog:before_open', [form]);

  form.dialog({
    modal: true,
    open(event, ui) {
      $('body').trigger('modal_dialog:after_open', [form]);
    },
    dialogClass: 'active_admin_dialog',
    buttons: {
      OK() {
        callback($(this).serializeObject());
        $(this).dialog('close');
      },
      Cancel() {
        $(this).dialog('close').remove();
      }
    }
  });
};
