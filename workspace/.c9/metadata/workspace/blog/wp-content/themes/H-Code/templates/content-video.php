{"filter":false,"title":"content-video.php","tooltip":"/blog/wp-content/themes/H-Code/templates/content-video.php","undoManager":{"mark":2,"position":2,"stack":[[{"start":{"row":10,"column":8},"end":{"row":10,"column":192},"action":"remove","lines":["<div><a href=\"<?php echo get_comments_link(); ?>\" class=\"comments\"><i class=\"fa fa-comment-o\"></i><?php echo comments_number( 'No comments', 'One comment', '% comments' ); ?></a></div>"],"id":2},{"start":{"row":10,"column":8},"end":{"row":10,"column":246},"action":"insert","lines":["<div><a href=\"<?php echo get_comments_link(); ?>\" class=\"comments\"><i class=\"fa fa-comment-o\"></i><?php echo comments_number( __('No comments', langdomain()), __('One comment', langdomain()), __('% comments', langdomain()) ); ?></a></div>"]}],[{"start":{"row":2,"column":31},"end":{"row":2,"column":41},"action":"remove","lines":["Posted by "],"id":3},{"start":{"row":2,"column":31},"end":{"row":2,"column":71},"action":"insert","lines":["<?php _e('Posted by ', langdomain()); ?>"]}],[{"start":{"row":11,"column":112},"end":{"row":11,"column":121},"action":"remove","lines":["View More"],"id":4},{"start":{"row":11,"column":112},"end":{"row":11,"column":154},"action":"insert","lines":["<?php _e('More Details', langdomain()); ?>"]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":0},"end":{"row":13,"column":6},"isBackwards":true},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1551747151398,"hash":"c8ea1bcab35bd06d4cd55fd37f89b59305d504bb"}