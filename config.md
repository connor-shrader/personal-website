+++
author = "Connor Shrader"
mintoclevel = 2

ignore = ["node_modules/", "components/"]

# RSS (the website_{title, descr, url} must be defined to get RSS)
generate_rss = true
website_title = "Franklin Template"
website_descr = "Example website using Franklin"
website_url   = "https://tlienart.github.io/FranklinTemplates.jl/"

prepath = "personal-website"
hasd3 = false
hasreact = false
+++

\newcommand{\R}{\mathbb R}
\newcommand{\scal}[1]{\langle #1 \rangle}
\newcommand{\loadscript}[1]{~~~<script src="!#1"></script>~~~}
\newcommand{\loadmodule}[1]{~~~<script type="module" src="!#1"></script>~~~}
\newcommand{\loadstyles}[1]{~~~<link rel="stylesheet" href="!#1"></link>~~~}
\newcommand{\emptydiv}[1]{~~~<div id="!#1"></div>~~~}
