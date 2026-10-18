document.addEventListener('DOMContentLoaded', function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.toggle-link'));
  var toggleAllLink = document.getElementById('toggle-all-link');

  function createSvgIcon(direction) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', '0 0 20 20');
    svg.setAttribute('class', 'svg-icon ' + direction + '-icon');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', direction === 'collapsed'
      ? 'M11.8 2.8L10.8 3.8 16.2 9.3 1 9.3 1 10.7 16.2 10.7 10.8 16.2 11.8 17.2 19 10z'
      : 'M8.2 17.2L9.2 16.2 3.8 10.7 19 10.7 19 9.3 3.8 9.3 9.2 3.8 8.2 2.8 1 10z');
    svg.appendChild(path);
    return svg;
  }

  function syncLink(link) {
    var target = document.getElementById(link.getAttribute('data-target'));
    if (!target) return;
    var collapsed = target.classList.contains('collapse');
    var collapsedIcon = link.querySelector('.collapsed-icon');
    var expandedIcon = link.querySelector('.expanded-icon');
    var label = collapsed ? 'Show Details' : 'Hide Details';

    // Update only the label text node; never replace the icons.
    var labelNode = link.querySelector('.toggle-label');
    if (!labelNode) {
      labelNode = document.createElement('span');
      labelNode.className = 'toggle-label';

      // The original markup already contains a plain-text label.
      // Remove direct text nodes before inserting the managed label span,
      // otherwise "Show Details" remains beside the new span and appears twice.
      Array.prototype.slice.call(link.childNodes).forEach(function (node) {
        if (node.nodeType === 3) link.removeChild(node);
      });

      link.insertBefore(labelNode, link.firstChild);
    }
    labelNode.textContent = label;
    if (collapsedIcon) collapsedIcon.style.display = collapsed ? 'inline' : 'none';
    if (expandedIcon) expandedIcon.style.display = collapsed ? 'none' : 'inline';
    link.setAttribute('aria-expanded', String(!collapsed));
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  }

  links.forEach(function (link) {
    if (!link.querySelector('.collapsed-icon')) link.appendChild(createSvgIcon('collapsed'));
    if (!link.querySelector('.expanded-icon')) link.appendChild(createSvgIcon('expanded'));
    syncLink(link);

    function toggle(event) {
      event.preventDefault();
      var target = document.getElementById(link.getAttribute('data-target'));
      if (!target) return;
      target.classList.toggle('collapse');
      syncLink(link);
    }
    link.addEventListener('click', toggle);
    link.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') toggle(event);
    });
  });

  if (toggleAllLink) {
    function syncAllLabel() {
      var targets = links.map(function (link) {
        return document.getElementById(link.getAttribute('data-target'));
      }).filter(Boolean);
      var allCollapsed = targets.every(function (target) { return target.classList.contains('collapse'); });
      toggleAllLink.textContent = allCollapsed ? 'Show Details' : 'Hide Details';
      toggleAllLink.setAttribute('aria-expanded', String(!allCollapsed));
    }
    toggleAllLink.addEventListener('click', function (event) {
      event.preventDefault();
      var targets = links.map(function (link) {
        return document.getElementById(link.getAttribute('data-target'));
      }).filter(Boolean);
      var allCollapsed = targets.every(function (target) { return target.classList.contains('collapse'); });
      targets.forEach(function (target) { target.classList.toggle('collapse', !allCollapsed); });
      links.forEach(syncLink);
      syncAllLabel();
    });
    syncAllLabel();
  }
});
