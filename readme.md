<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** rtybanana, web-brain-visualiser, rorypinknee, rorypinkney@yahoo.co.uk, BrainBoard, project_description
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
<!-- [![MIT License][license-shield]][license-url] -->
<!-- [![LinkedIn][linkedin-shield]][linkedin-url] -->



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/rtybanana/web-brain-visualiser">
    <img src="images/logo.png" alt="Logo">
  </a>

  <h3 align="center">BrainBoard</h3>

  <p align="center">
    A web-based MRI data visualisation tool which combines multiple graphical representations of brain connectivity into a single interactive dashboard.
    <br />
    <!-- <a href="https://github.com/rtybanana/web-brain-visualiser"><strong>Explore the docs »</strong></a>
    <br />
    <br /> -->
    <a href="https://polysoftit.co.uk/web-brain-visualiser">View Demo</a>
    ·
    <a href="https://github.com/rtybanana/web-brain-visualiser/issues">Report Bug</a>
    ·
    <a href="https://github.com/rtybanana/web-brain-visualiser/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <!-- <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul> -->
    </li>
    <li><a href="#usage">Usage</a></li>
    <!-- <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li> -->
    <li><a href="#contact">Contact</a></li>
    <!-- <li><a href="#acknowledgements">Acknowledgements</a></li> -->
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com)

Here's a blank template to get started:
**To avoid retyping too much info. Do a search and replace with your text editor for the following:**
`rtybanana`, `web-brain-visualiser`, `rorypinknee`, `rorypinkney@yahoo.co.uk`, `BrainBoard`, `project_description` -->


### Built With

* [Vue](https://vuejs.org/)
* [Highcharts](https://www.highcharts.com/)
* [Nilearn](https://nilearn.github.io/)



<!-- GETTING STARTED -->
## Getting Started

There are two ways to use BrainBoard. The easiest way is to use the live hosted version [here](https://polysoftit.co.uk/web-brain-visualiser); however, you may also clone the repo and host the website locally using VS Code [LiveServer](https://ritwickdey.github.io/vscode-live-server/) or a similar method.


<!-- USAGE EXAMPLES -->
## Usage

BrainBoard expects visualisation data to be provided in the following JSON format:

```json
{
  "timeseries": [
    // n_regions x n_timepoints  timeseries data
  ],
  "connectivity": [
    // n_regions x n_regions  connectivity matrix 
  ],
  "regions": [
    // n_regions x 3  region coordinates in world space
  ],
  "region_names": [
    // n_regions x 1  string names of regions
  ],
  "threshold": 0.3    // between 0 and 1 proportion of strong connections
} 
```

`threshold` refers to the default proportion of strong connections to include in the plots. This can be dynamically changed within BrainBoard using a slider.

For fMRI data, all of the above information can be created and exported with [Nilearn](https://nilearn.github.io/) after constructing timeseries data for your chosen atlas and niimg.

Here is an example of one way you might create the JSON object using Nilearn and Python. The `timeseries` variable refers to your atlased timeseries data. A description of how to get that is beyond the scope of this example.

```python
from nilearn.datasets import fetch_atlas_harvard_oxford
from nilearn.plotting import find_parcellation_cut_coords
from nilearn.connectome import ConnectivityMeasure
import json

correlation_measure = ConnectivityMeasure(kind='correlation')
correlation_matrices = correlation_measure.fit_transform([timeseries])
connectivity = correlation_matrices[0]

atlas = fetch_atlas_harvard_oxford(atlas_name='cort-maxprob-thr25-2mm')
regions = find_parcellation_cut_coords(atlas.maps)
region_names = atlas.labels

jsonobj = {
    'timeseries': timeseries.T.tolist(),
    'connectivity': connectivity.tolist(),
    'regions': regions.tolist(),
    'region_names': region_names,
    'threshold': 0.3
}

with open('harvard.json', 'w') as out:
    json.dump(jsonobj, out)
```


<!-- 
## Roadmap

See the [open issues](https://github.com/rtybanana/web-brain-visualiser/issues) for a list of proposed features (and known issues).


## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## License

Distributed under the MIT License. See `LICENSE` for more information.
 -->


## Contact

Rory Pinkney - [@rorypinknee](https://twitter.com/rorypinknee) - rorypinkney@yahoo.co.uk

<!-- Project Link: [https://github.com/rtybanana/web-brain-visualiser](https://github.com/rtybanana/web-brain-visualiser) -->



<!-- ACKNOWLEDGEMENTS -->
<!-- ## Acknowledgements

* []()
* []()
* []() -->





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/rtybanana/web-brain-visualiser.svg?style=for-the-badge
[contributors-url]: https://github.com/rtybanana/web-brain-visualiser/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/rtybanana/web-brain-visualiser.svg?style=for-the-badge
[forks-url]: https://github.com/rtybanana/web-brain-visualiser/network/members
[stars-shield]: https://img.shields.io/github/stars/rtybanana/web-brain-visualiser.svg?style=for-the-badge
[stars-url]: https://github.com/rtybanana/web-brain-visualiser/stargazers
[issues-shield]: https://img.shields.io/github/issues/rtybanana/web-brain-visualiser.svg?style=for-the-badge
[issues-url]: https://github.com/rtybanana/web-brain-visualiser/issues
[license-shield]: https://img.shields.io/github/license/rtybanana/web-brain-visualiser.svg?style=for-the-badge
[license-url]: https://github.com/rtybanana/web-brain-visualiser/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/rtybanana
