# Wenrui (Alina) Wu — Portfolio Source Dossier

**Purpose:** Source-grounded master document for a personal portfolio website aimed at technical peers, collaborators, and recruiters.

**Writing intent:** Formal, technically precise, evidence-conscious, and structured for downstream AI extraction. Each project is intentionally separated so that future agents can rewrite individual sections without mixing technologies, timelines, claims, or artifacts across projects.

**Evidence rule:**
- **Source-backed:** directly supported by the uploaded resume, source code, or other provided artifact.
- **Derived from source:** a cautious interpretation of the implementation or structure visible in the uploaded material.
- **External reference:** material found through web research that can be used to contextualize or deepen the project description. External references are *not* evidence that Wenrui used those sources unless separately confirmed.
- **Open question:** information that should be supplied by Wenrui before being stated as fact on the public site.

---

# 0. Portfolio-Wide Profile Snapshot

## 0.1 Identity and positioning
Wenrui (Alina) Wu is a Computer Science undergraduate at the Paul G. Allen School at the University of Washington, with a reported cumulative GPA of 4.0 and an expected Bachelor of Science degree in June 2028. The current materials show a portfolio spanning embedded systems, biomedical signal processing, algorithmic allocation, interactive web development, data analysis, robotics/computer vision, scientific software testing, and research on perceived relevance in case-based reasoning. [Resume: Education and Projects]

## 0.2 Current technical profile
The resume lists Python, Java, JavaScript, HTML/CSS, SQLite, and C/C++ as languages; GitHub, VS Code, Fusion, AutoCAD, Arduino IDE, LaTeX, PyCharm, IntelliJ, and Docker as developer tools; and pandas, NumPy, Matplotlib, LangGraph, LangChain, and Ultralytics YOLO among libraries/tools. [Resume: Technical Skills]

## 0.3 Portfolio themes visible across the materials
1. **Bridging software and physical systems:** The EMG project combines hardware structure, signal acquisition, embedded computation, Bluetooth-connected devices, and a mobile visualization layer.
2. **Algorithm-to-system thinking:** The course allocation project moves from preference generation to fractional allocation, deterministic allocation, decomposition, and evaluation rather than stopping at a single algorithmic primitive.
3. **Human-centered technical work:** The Shanghai quality-of-life project combines mixed-methods research with a concrete interactive map and neighborhood-accessibility interface.
4. **Applied engineering in technical organizations:** The Thermo Fisher internship combines computer vision, ROS2 motion control, software testing, workflow reverse-engineering, and onboarding.
5. **Data-driven research:** Social Futures Lab work uses survey data, pandas-based processing, and normalized principle vectors to study perceived similarity and relevance.

## 0.4 Overall professional narrative candidate
A strong site-level narrative supported by the materials is that Wenrui works at the boundary between computation and real-world systems: she is interested not only in implementing algorithms, but also in making them operational, observable, testable, and useful to people.

**Important:** The statement above is a portfolio-level synthesis, not a verbatim self-description from the resume. It should be treated as a drafting direction rather than an established personal brand statement until Wenrui confirms it.

---

# 1. Project: Monitoring Device for Muscle Usage & Behavior

## 1.1 Canonical project record

**Project title in source:** Monitoring Device for Muscle Usage & Behavior

**Timeline:** July 2025 – Present

**Technologies listed on resume:** Fusion, AutoCAD, Arduino, C/C++

**Project status:** Ongoing / actively being refined

**Resume-supported summary:**
- Designed hardware structures and prototyped 3D models of the monitoring device.
- Collected and processed electromyography (EMG) signals from multiple Bluetooth-connected devices.
- Built signal classification pipelines on ESP32 microcontrollers using the Arduino framework.
- Integrated muscle activity monitoring data with a mobile app for data visualization after exercise.
- Refining the user interface to improve usability and accessibility.

**Primary project domain:** Embedded systems + biomedical signal processing + hardware prototyping + mobile data visualization.

## 1.2 Project purpose / problem framing

### Confirmed purpose from project creator
The project was conceived to detect **real, physiological muscle activity during exercise**, with the practical goal of determining whether a particular muscle is actually being recruited during a training movement. The intended value is not merely to display EMG waveforms, but to turn muscle-activation measurements into actionable training feedback: when the expected muscle is not being sufficiently engaged, the user can adjust exercise technique, training intensity, or the overall training plan in time.

This sharpens the project's core problem statement:

> **Problem:** Exercise instructions and external movement appearance do not necessarily reveal which muscles are actually being recruited. A person may believe that a movement is targeting a particular muscle while the measured physiological response indicates otherwise.

> **Design goal:** Build a sensing and interpretation system capable of observing muscle activity during training and presenting that information in a form that can support timely adjustments to exercise technique, intensity, or programming.

> **Intended decision loop:** **measure muscle activity → interpret activation → compare with training intent → identify mismatch → adjust exercise → re-measure.**

This clarification is provided directly by Wenrui and should be treated as the authoritative statement of project intent for future website writing.

### System-level interpretation
The resume's implementation details align with this goal: EMG signals are collected from multiple Bluetooth-connected devices, processed/classified on ESP32 microcontrollers, and integrated with a mobile application for visualization. [Resume: Project description] The system can therefore be presented as an attempt to close the loop between **physiological measurement** and **training decisions**, rather than as a generic EMG visualization project.

The central portfolio narrative is consequently stronger than “I built an EMG monitor.” The project is an engineering attempt to translate a difficult-to-observe physiological variable—actual muscle recruitment—into feedback that can inform exercise decisions.

### CAD artifact inspection
The newly supplied `整合.step` file is a valid STEP mechanical CAD artifact generated through Autodesk's translation pipeline. The file contains one `MANIFOLD_SOLID_BREP` body and thousands of geometric entities, including circular, cylindrical, toroidal, planar, and spline-based surfaces. Programmatic CAD import confirms **one solid body** with an approximate bounding box of **30.79 × 58.00 × 10.00** in the model's source units. This establishes that the uploaded file represents a concrete 3D mechanical part/model rather than only a conceptual sketch.

The STEP file alone does not expose a human-readable part name, assembly role, intended mounting position, sensor placement, or ergonomic rationale. Those details should only be added after the designer confirms them.

### What the current materials do NOT establish
The uploaded materials do not specify:
- the exact target users or use case;
- the muscles being monitored;
- the exact EMG sensor model(s);
- the number of simultaneous channels;
- the exact Bluetooth protocol or topology;
- the classification labels/classes;
- the classifier architecture or training method;
- the mobile platform (iOS, Android, cross-platform framework, etc.);
- the exact final enclosure dimensions;
- whether the system is intended for sports, rehabilitation, ergonomics, exercise science, accessibility, or another domain;
- quantitative classification accuracy or latency;
- battery life;
- final hardware cost;
- the exact attachment method used to secure the wearable enclosure to the arm or leg.

These should not be invented in future website copy.

## 1.3 Design / ideation

### Evidence-backed design dimensions
The project clearly spans multiple layers of the stack:

**Physical layer**
- Hardware structures were designed and prototyped in Fusion and AutoCAD.
- The existence of 3D modeling indicates that physical geometry and manufacturability/form factor were part of the design process.

**Signal layer**
- EMG signals are collected from multiple Bluetooth-connected devices.
- Signal processing occurs before classification.

**Embedded computation layer**
- ESP32 microcontrollers are used.
- The Arduino framework is used for the embedded pipeline.

**Application layer**
- Muscle activity monitoring data is integrated with a mobile application.
- The interface is being iteratively refined for usability and accessibility.

### Engineering interpretation
A website narrative can legitimately emphasize that the project is not a single-script software exercise. It is a system integration problem in which sensing, real-time computation, wireless communication, and human-facing visualization must work together.

This is a **derived interpretation**, not a direct quotation from the resume.

## 1.4 Signal-processing reference context

The uploaded `EMGFilters.cpp` is clearly derived from or compatible with the OYMotion EMGFilters implementation. The source contains OYMotion copyright and implements:
- a second-order Butterworth low-pass filter with a 150 Hz cutoff;
- a second-order Butterworth high-pass filter with a 20 Hz cutoff;
- a fourth-order anti-hum/notch filter for 50 Hz or 60 Hz interference;
- selectable 500 Hz and 1000 Hz sample-frequency coefficients;
- configurable enable/bypass behavior for notch, low-pass, and high-pass filtering. [Uploaded EMGFilters.cpp]

The filtering pipeline in the uploaded implementation is sequential: notch filtering first, then low-pass filtering, then high-pass filtering. [Uploaded EMGFilters.cpp]

### External scientific context
An independently published study using an OYMotion EMG filter module describes a comparable cascade of an anti-hum notch filter, a second-order Butterworth low-pass filter, and a second-order Butterworth high-pass filter, with 50 Hz power-line suppression, a 150 Hz upper cutoff, and a 20 Hz lower cutoff at a 500 Hz sampling rate. citeturn897629search26

Broader sEMG literature also commonly uses a roughly 20–500 Hz analysis range and notch filtering around 50/60 Hz to mitigate power-line interference, while noting that notch filtering can also remove signal content near the interference frequency. citeturn897629search7turn897629search2

### Important portfolio wording constraint
Do **not** write that Wenrui independently designed the OYMotion filter from first principles based solely on the uploaded file. The current artifact includes the OYMotion copyright notice and therefore should be presented as an integrated/reference software component unless Wenrui confirms independent reimplementation or modification.

## 1.5 Implementation details visible in the supplied artifact

The C++ source defines two internal filter classes:

### `FILTER_2nd`
This class stores two state variables and numerator/denominator coefficients for a second-order filter. During initialization it selects either low-pass or high-pass coefficients based on sample frequency. During each update, it computes the current internal state and output, then shifts the state variables for the next sample. [Uploaded EMGFilters.cpp]

### `FILTER_4th`
This class implements a fourth-order anti-hum filter as a cascade of two second-order stages, with four state variables and a gain term. It supports 50 Hz and 60 Hz notch configurations for both 500 Hz and 1000 Hz sampling frequencies. [Uploaded EMGFilters.cpp]

### `EMGFilters::init`
The wrapper initializes the LPF, HPF, and anti-hum filter and stores feature-enable flags. It also bypasses the filtering implementation when unsupported sampling/notch frequency combinations are supplied. [Uploaded EMGFilters.cpp]

### `EMGFilters::update`
The update method processes the input in the order:
1. notch / anti-hum filtering when enabled;
2. low-pass filtering when enabled;
3. high-pass filtering when enabled.

The implementation operates sample-by-sample, which is appropriate for embedded streaming rather than offline batch processing. [Uploaded EMGFilters.cpp]

## 1.6 Physical artifacts

### Confirmed / reported
- Hardware structures.
- 3D models/prototypes created in Fusion and AutoCAD.
- A supplied STEP CAD artifact and screenshots documenting a two-part wearable enclosure with a main body, a lid, and internal structures for compact hardware placement.
- Openings reserved for the power switch and charging port so the assembled device can be operated and recharged.
- A completed, operational hardware prototype designed to be worn on the arm or leg.
- Multiple Bluetooth-connected EMG devices.
- ESP32-based embedded hardware.
- A software and mobile-visualization layer that remains under development.

### Not currently supplied
- Additional CAD source files beyond the supplied STEP artifact.
- Rendered CAD images.
- Photographs of the physical prototype.
- PCB/schematic files.
- Sensor BOM.
- Wiring diagram.
- ESP32 board model.
- enclosure drawings.
- mobile-app source code.
- screenshots of the mobile interface.
- sample raw EMG recordings.
- sample filtered signals.
- classifier evaluation output.

## 1.7 Process reconstruction

The most defensible high-level workflow, based on the resume and artifacts, is:

**Physical design → EMG acquisition → streaming signal processing → embedded classification → wireless/data integration → mobile visualization → UI refinement.**

The exact sequence of development milestones, however, is not documented in the supplied files. A future website should describe this sequence as a conceptual system pipeline unless Wenrui supplies actual development history.

## 1.8 Candidate project milestones to document later

Recommended milestone categories for future reconstruction:
- Initial problem definition.
- First sensing prototype.
- First reliable EMG acquisition.
- Multi-device synchronization.
- ESP32 integration.
- First filtering pipeline.
- First classifier.
- Bluetooth communication prototype.
- First mobile visualization.
- Hardware form-factor iteration.
- Usability/accessibility iteration.
- Current prototype state.

## 1.9 Possible future improvements / extensions

These are **proposed future directions**, not existing features:
- Quantitative benchmarking of classification accuracy, confusion matrix, inference latency, and robustness across users.
- Calibration procedures that normalize inter-person variation.
- More explicit signal-quality monitoring and electrode/contact-quality detection.
- Artifact rejection for movement and electrode displacement.
- On-device feature extraction to reduce wireless bandwidth.
- Battery and power-consumption optimization.
- Timestamp synchronization across multiple Bluetooth-connected channels.
- Structured data logging for longitudinal exercise analysis.
- Accessibility-oriented interface testing with representative users.
- Explainable activity labels that connect classifier output to interpretable muscle-use patterns.
- Automated model update or personalization pipeline.

## 1.10 Website-ready positioning themes

Potential themes for a recruiter-facing presentation:
- “A full-stack physical computing project spanning mechanical design, embedded systems, signal processing, wireless communication, and mobile visualization.”
- “Designed to bridge raw physiological signals and interpretable post-exercise feedback.”
- “An ongoing prototype where hardware and software are developed together rather than independently.”

These phrases are drafting candidates, not source statements.

## 1.11 Final firmware / current implementation clarification

`EMG_Count(1).ino` is confirmed by Wenrui to be the **current final firmware version** for the project. It should therefore be treated as the authoritative implementation artifact when describing the current embedded workflow.

### Calibration
The final firmware implements a **3-second calibration window** rather than the 5-second duration mentioned earlier in conversation. During this window, the system repeatedly acquires EMG, processes the signal, and records the maximum processed value as `resetValue`, the individual's current 100% reference for the muscle being calibrated.

The calibration pipeline in the final firmware is:

**EMG input → EMG filtering → squaring → Kalman filtering → peak-value selection → individual reference (`resetValue`)**

The public portfolio should use the final firmware's 3-second implementation when describing the current system. The earlier 5-second description should not be presented as an implemented final behavior.

### Real-time intensity classification
The final firmware sets `setNumber = 4`, so the implemented intensity representation is divided into **four fixed bands**, not five 20%-wide bands:

- 0–25% of the current reference
- 25–50%
- 50–75%
- 75% and above

The current implementation calculates an intensity index by dividing the processed EMG value by `resetValue / setNumber`. Values above the highest index are clamped to the highest band. Therefore, the current implementation does **not** preserve a separate `>100%` category.

### Session-level output
For each processed sample, the firmware increments the counter corresponding to the current intensity band. At the end of the exercise/session, it converts each band's sample count into a percentage of the total recorded samples.

Conceptually:

\[
P_i = \frac{N_i}{N_{total}} \times 100\%
\]

where `N_i` is the number of samples assigned to intensity band `i` and `N_total` is the total number of counted samples. Assuming a stable sampling interval, this serves as an approximation of the percentage of recorded exercise time spent in each intensity band.

The current user-facing output is therefore **a proportional distribution across intensity bands**, rather than a continuous force estimate or a fully developed training recommendation system.

### Processing chain confirmed from firmware
The final `.ino` shows a more specific processing sequence than the earlier `EMGFilters.cpp` artifact alone:

**Raw analog EMG → EMG filter → squared signal → Kalman filter → intensity band classification → sample counting → session percentages**

This is important because the project's current analysis is not based on raw EMG thresholding alone. The classification input is a processed signal.

### Current mobile/software status
The firmware transmits the resulting proportions, but the user-facing interface is still being developed. The project should therefore be described as having a **functional quantitative measurement/output layer with an unfinished visualization and interpretation layer**.

### Current limitation and proposed adaptive calibration
The final firmware currently sends any processed signal above the current reference into the highest intensity band. There is no dedicated representation of “above 100% MVC” and no automatic recalibration.

Wenrui proposed a future mechanism in which sustained activity above the current reference would trigger recalibration:

**Current reference → detect sustained >100% activity → compare duration against a significance threshold → update/recalibrate reference if the condition is met.**

This is a proposed future improvement, not a current implementation. The significance threshold has not yet been experimentally determined.

### User interpretation boundary
The project should use terminology such as **relative EMG level**, **relative muscle activation**, or **relative muscle exertion inferred from EMG**, rather than claiming that the system directly measures mechanical force. The current metric represents the distribution of processed EMG activity relative to an individual reference.

## 1.12 Ideation and design evolution

The project's initial motivation came from a practical observation: a smartwatch can provide feedback such as heart rate during exercise, but it does not reveal whether the intended muscle is actually being recruited, or whether a muscle remains under stress and may need recovery.

The team considered two main sensing strategies:

### Candidate 1 — EMG
EMG was the preferred conceptual approach because it provides a physiological signal directly associated with muscle activation.

### Candidate 2 — Angular displacement / motion sensing
Mentors and Wenrui considered an angular displacement detector as an alternative. The limitation discovered during evaluation was that this approach depended on a sufficiently large muscle contraction causing a detectable change in the skin's geometry. Small or subtle contractions would not necessarily create enough visible/angular displacement to be reliably measured.

The project therefore returned to EMG and focused on processing signal strength into interpretable levels of muscle use. Initial experiments with simple circuits transmitting EMG signals to a computer indicated that the signal was sufficiently observable to pursue the approach.

### Hardware engineering evolution
After selecting EMG, the project expanded into hardware and mechanical engineering:
- designed the circuit and hardware architecture around ESP32;
- practiced and performed soldering to connect the main boards and establish signal communication;
- arranged boards and battery placement to minimize occupied volume;
- modeled the enclosure in Fusion 360 so the device could be placed on different muscle locations;
- separated the enclosure into a main body and lid, with internal clearances for the electronics;
- reserved accessible openings for the power switch and charging port;
- used 3D printing to produce prototypes and test multiple physical versions;
- iterated toward a smaller enclosure capable of containing the required electronics.

The CAD screenshots and STEP artifact should therefore be presented as evidence of **iterative mechanical prototyping**, not merely as a static CAD exercise.

## 1.13 Current project maturity

The project has progressed beyond concept ideation into an assembled, operational hardware prototype with embedded signal processing and a quantitative session-analysis mechanism. The current completed layer is:

**Physical enclosure + sensing hardware → embedded signal processing → individual calibration → fixed-band classification → training-session percentage output**

The software, data-analysis, and user-interface layers remain in development. Future work also includes testing the interface with users to understand what information they need from a post-exercise summary and which visual explanations are easiest to interpret.

The following layers remain in development:

**Polished mobile interface → longitudinal muscle-growth tracking → intelligent exercise interpretation → personalized recommendations → adaptive MVC/reference updates.**

## 1.14 Open questions for Wenrui

1. What is the exact intended use case and target user for the monitoring device?
2. What EMG sensor hardware is used?
3. How many channels can be collected simultaneously?
4. What specific muscle activities/classes does the classifier identify?
5. What signal-processing steps are your own implementation versus adapted libraries?
6. What machine-learning or classification method is used?
7. What mobile technology stack is used?
8. How is the wearable enclosure currently secured to the arm or leg?
9. What are the most important quantitative results so far?
10. What was the biggest engineering bottleneck?

---

# 2. Project: Automatic and Satisfactory Course Assignment

## 2.1 Canonical project record

**Project title in source:** Automatic and Satisfactory Course Assignment

**Timeline:** January 2024 – March 2025

**Technologies listed on resume:** Python, NumPy

**Project ownership confirmed by Wenrui:** independently designed and implemented, with mentor guidance focused on research and algorithm direction rather than code implementation.

**Resume-supported outcomes:**
- Researched and evaluated assignment algorithms based on satisfaction and allocation efficiency.
- Designed and implemented allocation methods using the Simultaneous Eating and Birkhoff Decomposition algorithms to optimize overall satisfaction.
- Incorporated feedback from 30+ professors and peers to optimize algorithm design, improving runtime by 200+%.
- Extended the algorithm to implement a parent–teacher meeting scheduler.

## 2.2 Central problem

The project addresses an allocation problem: assigning students to capacity-constrained courses while attempting to optimize satisfaction rather than merely filling available seats.

Wenrui recalls that the original elective-course process may have involved random allocation, but does not remember the prior mechanism with enough confidence for a public claim. Public-facing copy should describe the allocation problem without asserting how the previous system worked.

The supplied code makes the underlying modeling concrete:
- each student has an ordered preference list;
- the initial generator creates a randomized ordering of courses and retains the top three preferences;
- capacities are represented as `total_lst`;
- a fractional probability allocation is computed;
- a deterministic assignment is then produced from those fractional probabilities;
- an additional decomposition step produces a lottery/collection of deterministic allocation matrices with associated coefficients;
- a scoring function measures the quality of each student's resulting course choice. [Uploaded Task01.py, Task01+02.py, Task03.py, Task04.py]

## 2.3 Source code architecture

The submitted materials separate the system into four conceptual tasks.

### Task 01 — Preference generation
`preference_matrix(stu, cor)` constructs a preference profile by generating a random permutation of all course IDs for each student and keeping the first three entries. [Uploaded Task01.py]

This creates a minimal preference model suitable for experimentation:
- rows correspond to students;
- entries correspond to course identifiers;
- only the top three choices are retained.

**Interpretation:** this was likely designed as a simulation harness rather than a real registration-data ingestion layer.

### Task 01 + 02 — Fractional allocation / “eating” process
The combined file defines `probability_matrix(a, total_lst, p)`. It maintains:
- `probability_lst`: fractional allocation probabilities per student-course pair;
- `eaten_lst`: how much capacity has been consumed for each course;
- `left_lst`: remaining allocation mass for each student;
- `now_lst`: the currently chosen course for each student;
- `none_lst`: courses that should no longer be considered available. [Uploaded Task01+02.py]

The algorithm iteratively determines a step size `eat` from course-capacity constraints and student remaining probability mass. Students assigned to their current top available choice accumulate fractional probability for that course. When a course becomes unavailable or a student's probability mass reaches one, the state advances. [Uploaded Task01+02.py]

The implementation therefore operationalizes the “simultaneous eating” idea as a discrete numerical simulation with step size `p`.

### Task 03 — Deterministic allocation
`allocation(probability_matrix, total_lst)` constructs a 0/1 student-course assignment matrix. For each active student, it identifies the highest remaining probability entry and creates conflicts when multiple students compete for a course with insufficient remaining capacity. [Uploaded Task03.py]

When multiple students compete for the same remaining seats, the code stores the conflicting students in `random_dic` and selects among them randomly until the available capacity is exhausted. If a student's probability row becomes unusable, the implementation assigns the student to a remaining course at random. [Uploaded Task03.py]

This is important architecturally: the project does not simply return a fractional allocation. It contains an explicit conversion layer from probabilistic preferences to a concrete course assignment.

### Task 04 — Evaluation
`score(a, allocation_lst)` evaluates whether the assigned course appears in each student's top-three list and converts the resulting rank into a direct score and a 1–5 satisfaction score. It then computes the mean and standard deviation of the satisfaction scores. [Uploaded Task04.py]

The direct scoring code assigns a higher score to higher-ranked choices, using the number of courses as the normalization base. The satisfaction score is discretized into five bands:
- 90+ → 5;
- 80–89 → 4;
- 70–79 → 3;
- 60–69 → 2;
- below 60 → 1. [Uploaded Task04.py]

## 2.4 Birkhoff decomposition implementation

The combined implementation contains `decomposition(probability_matrix, total_lst, p)`. It repeatedly:
1. computes a deterministic allocation matrix from the current probability matrix;
2. identifies the smallest probability coefficient associated with the selected assignment entries;
3. stores the allocation matrix and coefficient;
4. subtracts the corresponding weighted allocation from the probability matrix;
5. continues until the remaining probability mass reaches zero or a safety iteration limit is reached. [Uploaded Task01+02.py]

Conceptually, this is a decomposition of a fractional allocation into a weighted collection of deterministic allocations.

External mathematical reference: the Birkhoff–von Neumann theorem states that a doubly stochastic matrix can be represented as a convex combination of permutation matrices. citeturn515935search4turn515935search24

External mechanism-design reference: Bogomolnaia and Moulin's 2001 work introduced the Probabilistic Serial mechanism for the random assignment problem and emphasized ordinal efficiency, while comparing its properties with Random Priority. citeturn515935search0

A later open-access paper describes the Simultaneous Eating Algorithm as a generalization of the probabilistic-serial framework and explicitly discusses its use for allocating divisible or indivisible goods with ordinal preferences. citeturn635696search0

A course-allocation-focused operations research paper similarly describes Probabilistic Serial as a mechanism for unit-demand assignment, noting its use for fair and efficient course-seat allocation. citeturn635696search1

## 2.5 What the project demonstrates technically

### Algorithm design
The project shows an attempt to translate a mathematical allocation mechanism into executable code, including state tracking, capacity exhaustion, tie/conflict handling, and a final deterministic assignment step.

### Systems decomposition
The code is organized into conceptually separable stages rather than one monolithic function:
- preference generation;
- fractional allocation;
- deterministic allocation;
- probabilistic decomposition;
- evaluation.

### Experimental mindset
The code includes experiments with six students and three courses, as well as a commented benchmark scenario with 500 students and 25 courses. The benchmark setup tracks average assignment completion, runtime, course-capacity violations, and overall execution time. [Uploaded Task01+02.py]

### Numerical approximation
The `p` parameter is used as a discrete probability/consumption step. The default examples use `0.01` or `0.001`, which indicates an approximate numerical simulation rather than exact symbolic arithmetic. [Uploaded Task01+02.py]

## 2.6 Runtime optimization evidence

The resume states that feedback from 30+ professors and peers was incorporated and that algorithm design was optimized, with runtime “improving by 200+%.” [Resume: Projects]

The code snapshot alone does not prove the exact before/after benchmark or the precise interpretation of the percentage. The website should therefore preserve the wording as a reported project result unless a benchmark table or commit history is supplied.

### What would strengthen this claim
- before/after runtime measurements;
- dataset sizes;
- hardware/runtime environment;
- number of trials;
- median and mean execution time;
- algorithmic bottleneck identified;
- exact optimization changes;
- complexity discussion.

## 2.7 Feedback-driven development

The resume explicitly reports feedback from 30+ professors and peers. This is a notable project-development story because it connects algorithmic design to stakeholder evaluation rather than treating the algorithm as purely theoretical. [Resume: Projects]

Wenrui later recalled that these discussions mainly concerned possible application scenarios and the need for real-world data. This recollection is approximate, and no contemporaneous feedback record is currently available. Public copy may describe these discussion themes but should not attribute specific technical recommendations to the reviewers.

A future case-study page could distinguish:
- **who gave feedback:** professors vs. peers;
- **what they evaluated:** satisfaction, fairness, usability, runtime, or explainability;
- **what changed:** algorithm logic, data structures, tie-breaking, interface, or evaluation metric;
- **how the change was measured:** quantitative benchmark or qualitative feedback.

Those details are not available in the current files.

## 2.8 Extended application: parent–teacher meeting scheduler

The resume states that the course-assignment algorithm was extended into a parent–teacher meeting scheduler. [Resume: Projects]

Wenrui confirmed that this scheduler was used in an actual class-wide parent–teacher meeting involving approximately 20–30 families. Parents ranked preferred time slots, and the system assigned meetings within the available capacity. The deployment reduced manual scheduling for teachers, balanced attendance across time slots, and kept adjusted appointments close to each parent’s preferred time.

The current upload does not contain the scheduler implementation, interface, scheduling constraints, or output examples. The deployment can be described as a confirmed extension, but its scale and outcomes should remain qualitative until supporting artifacts are supplied.

### Useful future documentation to add
- entities being scheduled;
- hard vs. soft constraints;
- teacher/student/parent availability representation;
- objective function;
- conflict resolution;
- scalability;
- interface/screenshots;
- example input/output;
- whether the same allocation/decomposition mechanism is directly reused or only conceptually adapted.

## 2.9 Physical / tangible artifacts

Potential artifacts, currently unprovided:
- source repository;
- experiment outputs;
- plots of satisfaction distributions;
- runtime benchmark graphs;
- decomposition visualization;
- sample allocation matrices;
- scheduler interface;
- presentation slides;
- peer/professor feedback records.

## 2.10 Recommended visuals for website

1. **Problem diagram:** students → preferences → course capacities → fractional allocation → deterministic assignment.
2. **Allocation heatmap:** probability matrix before and after decomposition.
3. **Satisfaction plot:** distribution of 1–5 satisfaction scores.
4. **Runtime plot:** baseline versus optimized version.
5. **Example decomposition:** one fractional matrix represented as a weighted set of deterministic matrices.

## 2.11 Potential future improvements

- Replace synthetic random preferences with anonymized real preference data.
- Add explicit fairness metrics in addition to satisfaction.
- Compare Simultaneous Eating / Probabilistic Serial against Random Serial Dictatorship, deterministic greedy baselines, and optimization-based methods.
- Add reproducible random seeds for benchmark runs.
- Separate the mathematical mechanism from the simulation/benchmark layer.
- Add unit tests for capacity conservation and probability-mass conservation.
- Add invariant checks proving that no course exceeds capacity and every student receives the required assignment.
- Improve tie-breaking transparency rather than using opaque randomness.
- Profile the implementation and report asymptotic complexity.
- Add a real scheduling front end for the parent–teacher extension.

## 2.12 Original presentation / research references

The original project presentation used the following seven references. These should be retained as the project's historical reference set and should not be silently replaced by newer contextual references:

1. A. Bogomolnaia and H. Moulin, *A New Solution to the Random Assignment Problem*, Journal of Economic Theory 100 (2001) 295.
2. A. Katta and J. Sethuraman, *A Solution to the Random Assignment Problem on the Full Preference Domain*, Journal of Economic Theory 131 (2006) 231.
3. H. Aziz, *Simultaneously Achieving Ex-Ante and Ex-Post Fairness*, in Web and Internet Economics: WINE 2020, 341.
4. H. Aziz and F. Brandl, *The Vigilant Eating Rule: A General Approach for Probabilistic Economic Design with Constraints*, Games and Economic Behavior 135 (2022) 168.
5. A. Abdulkadiroğlu and T. Sönmez, *Random Serial Dictatorship and the Core from Random Endowments in House Allocation Problems*, Econometrica 66 (1998) 689.
6. G. Birkhoff, *Three Observations on Linear Algebra*, Universidad Nacional de Tucumán, Revista A. 5 (1946) 147.
7. L. Lovász and M. Plummer, *Matching Theory*, Annals of Discrete Mathematics 29 (1986) 544.

### Historical intellectual lineage
The references map onto distinct parts of the project:

- **Random assignment:** Bogomolnaia & Moulin; Katta & Sethuraman.
- **Fairness:** Aziz.
- **Probabilistic / eating-rule design:** Aziz & Brandl.
- **Alternative random assignment mechanism:** Abdulkadiroğlu & Sönmez.
- **Matrix decomposition:** Birkhoff.
- **Matching theory:** Lovász & Plummer.

These references should be presented as the project's historical intellectual foundation. They are not, by themselves, evidence that every theorem or method from each source was implemented.

## 2.13 Original problem framing and four design criteria

The project proposed a **probabilistic assignment mechanism** with four explicit objectives:

1. **Automation** — reduce manual effort and make course allocation computable.
2. **Efficiency** — allocate course capacity effectively.
3. **Fairness** — avoid systematically predictable or manipulable allocation outcomes and provide a defensible probabilistic mechanism.
4. **Satisfactoriness** — increase the likelihood that students receive courses they prefer.

These four properties were used as the central comparison framework for alternative assignment methods.

### Historical fairness interpretation
From the original presentation, the project treated fairness as a property of the allocation mechanism and regarded the **Random Ticket** realization as strongest in fairness because the final deterministic allocation was selected randomly rather than by a predictable deterministic ordering.

The project referenced formal work on ex-ante and ex-post fairness, but the available materials do not establish that the implementation reproduced the full formal fairness algorithm from those papers. Public-facing copy should therefore describe the project as **informed by fairness literature** rather than as implementing a complete formal fairness theorem/mechanism.

## 2.14 Reconstructed algorithm workflow

The historical algorithm can be reconstructed as follows:

**Student preferences**
→ preference matrix

**Preference matrix**
→ Simultaneous Eating / probabilistic allocation

**Probabilistic matrix**
→ fractional allocation problem

**Birkhoff decomposition**
→ weighted collection of deterministic allocation matrices

**Realization step**
→ either maximum-weight deterministic allocation or a random ticket among the decomposed allocations

**Evaluation**
→ satisfaction scoring + Monte Carlo simulation

This distinction should be preserved because the project solves both a **probabilistic allocation problem** and a **real-world realization problem**.

## 2.15 Quantitative evaluation from original presentation

The original presentation reports **1,000 Monte Carlo simulations** comparing assignment strategies through satisfaction scores.

The presentation reports that probabilistic assignment with the maximum-weight deterministic allocation gave approximately:
- **70% chance** of receiving a top-two preferred option;
- **92% chance** of receiving a top-three preferred option.

These numbers are historical project presentation results. They should be labeled as **reported simulation results** unless the underlying simulation output is recovered and independently re-run.

The presentation's comparative conclusion was:

- **First-Come-First-Serve:** strongest in automation because it consumed the least CPU time.
- **Random Ticket:** strongest in fairness because the result was randomized and harder to predict/manipulate in advance.
- **Probabilistic assignment + maximum weight:** strongest in satisfactoriness while remaining balanced across the other three objectives.

## 2.16 Iterative algorithm improvement

A specific version change concerned the treatment of residual probability when some courses still had capacity while some students still had unfilled assignment capacity.

### Version 1
Remaining courses were randomly selected to distribute the remaining fractional “cake” pieces. This could result in students consuming probability mass from less-preferred courses unnecessarily.

### Version 2
The residual distribution was redesigned so that remaining course capacity and remaining student capacity were balanced more evenly. The stated goal was to reduce the probability that students would consume more low-preference “pieces” than necessary and to make the resulting probability matrix more even/fair.

This is a substantive algorithm-design iteration, not merely a code cleanup.

## 2.17 External discussion and transfer

The project was presented to 30+ college students and professors during the National Round of China Thinks Big. Wenrui recalls that the discussion explored further applications and the value of evaluating the mechanism with real-world preference data.

The resulting mechanism was later adapted to a **parent–teacher meeting time-slot allocation problem** and deployed in a class-wide meeting. Parents ranked preferred slots. The scheduler reduced manual planning for teachers, balanced the number of meetings across available slots, and kept necessary adjustments close to the submitted preferences. [Resume: Projects; user-confirmed deployment details]

The public portfolio should make clear that this is an **extension of the allocation framework to a second real-world scheduling problem**, not a separate unrelated project.

## 2.18 Open questions for Wenrui

1. What was the exact allocation process used before this project? Wenrui recalls that it may have been random but is not certain.
2. **Resolved for public copy:** “satisfactory” refers to overall student satisfaction, evaluated through preference-ranking outcomes.
3. **Resolved:** the 1,000 reported simulations used synthetically generated preferences and course capacities.
4. Which part of the implementation is specifically your own interpretation of Simultaneous Eating / Probabilistic Serial?
5. How exactly did Birkhoff decomposition enter the production of a final random assignment?
6. **Partially resolved:** discussion themes included application scenarios and the need for real-world data; exact feedback records are unavailable.
7. What optimization produced the reported runtime improvement?
8. What were the baseline and optimized benchmark numbers?
9. **Partially resolved:** parents ranked preferred time slots and the adapted system assigned meetings within slot capacity; exact implementation details remain unavailable.
10. What is the most interesting failure case you encountered?

---

# 3. Project: Quality of Life in Shanghai

## 3.1 Canonical project record

**Project title in source:** Quality of Life in Shanghai

**Timeline:** September 2023 – May 2024

**Technologies listed on resume:** HTML/CSS, JavaScript

**Team scope:** Led a team of 8 students.

**Resume-supported activities/outcomes:**
- Led a mixed-methods study of urban quality of life.
- Collected and analyzed data from 20+ questionnaires and interviews.
- Used findings to drive actionable community insights.
- Built an interactive neighborhood map website enabling residents to locate nearby facilities within a custom walking-distance radius.
- Organized 2+ publicity campaigns focused on food safety and anti-fraud education.

## 3.2 Research framing

The project combines social research with a public-facing technical artifact. It is therefore best represented as a **mixed-methods civic-technology project** rather than simply a front-end website.

The resume establishes that both quantitative/structured questionnaire data and qualitative interviews were part of the project. It does not provide the complete research instrument, coding scheme, sample demographics, statistical tests, or final findings, so these details should not be invented.

## 3.3 Website implementation evidence

The uploaded website source reveals a map-centered interaction model.

### Visual structure
The HTML places a `map.png` image as the main map canvas and overlays multiple point elements on top of it. [Uploaded index.html]

The project defines categories including:
- drink;
- health;
- bus;

and also contains navigation items for food and shopping even though the supplied point examples are concentrated in drink, health, and bus categories. [Uploaded index.html]

### Walking-radius interface
The interface provides three controls:
- 5 min;
- 10 min;
- 15 min.

These controls are wired to JavaScript event listeners and determine which groups of points are visible. [Uploaded index.html, index.js]

### Category filtering
The navigation buttons toggle visibility for category-specific points. The JavaScript tracks the currently selected categories in the `show` array and updates the visual state of the category button as selections change. [Uploaded index.js]

### Point positioning
The CSS defines explicit `top` and `left` positions for multiple map points rather than using geographic coordinates. For example, `#p1` is positioned at `top: 505px; left: 1020px`, while other points have individually specified positions. [Uploaded index.css]

This indicates that the supplied version is a custom fixed-map visualization rather than a dynamic GIS implementation.

### Detail panel
The HTML contains a `#detail` panel that is hidden by default, and the JavaScript exposes it when the sample point `p2` is clicked. [Uploaded index.html, index.css, index.js]

This establishes an intended interaction pattern in which selecting a map point can reveal additional place details, even though the supplied source does not include the complete detail-content implementation.

## 3.4 Technical architecture visible in the source

### HTML
The structure consists of three major UI regions:
1. the map and point layer;
2. the category navigation controls;
3. the walking-time controls and detail panel. [Uploaded index.html]

### CSS
The stylesheet emphasizes fixed-position overlays, manually positioned points, category icons, and a right-side control area. The map height is fixed at 1100px, and the detail panel is positioned as a 300px-wide fixed overlay. [Uploaded index.css]

### JavaScript
The JavaScript is event-driven and stateful. It registers click handlers for walking-time filters and category filters. It dynamically changes element visibility and selected-button styling. [Uploaded index.js]

## 3.5 Interaction logic

The distance controls work by changing a global `num` state to 5, 10, or 15 and hiding points belonging to larger distance groups. [Uploaded index.js]

For example, selecting the 5-minute view sets `num = 5`, hides 10- and 15-minute points, and re-applies currently active category filters. [Uploaded index.js]

The category controls use paired “show” and “hide” functions so that a category can be toggled on and off. [Uploaded index.js]

The implementation therefore combines two dimensions of filtering:
- **distance/time radius**;
- **facility category**.

## 3.6 Source-level design observations

### Strengths
- The project has a concrete public-facing interaction instead of presenting research only as a report.
- The use of progressive visibility states makes the main interaction easy to explain.
- The code separates distance filtering and category filtering into distinct functions.
- The interface is icon-driven, which supports quick visual scanning.

### Technical limitations visible in the snapshot
These are source-derived observations and should be framed as engineering observations, not criticisms of the completed project:
- point positions are hard-coded in pixels;
- the map is a static image rather than a dynamic geographic layer;
- the sample source contains a repeated HTML `id="p21"`, which is invalid HTML uniqueness-wise;
- the detail interaction is only wired to `p2` in the supplied JavaScript;
- there is no visible data model or external dataset in the supplied files;
- accessibility implementation is not visible in the supplied HTML/CSS/JS.

The repeated `p21` identifier and the limited detail handler are direct observations from the supplied snapshot. [Uploaded index.html, index.js]

## 3.7 Research-to-product process

The strongest evidence-supported narrative is:

**Community research → questionnaire/interview analysis → identification of local needs → interactive map concept → category and walking-time filtering → public/community communication.**

The exact research findings that led to the selected categories are not present in the uploaded files. The category choices should therefore not be described as statistically derived unless supporting research materials are supplied.

## 3.8 External reference material for the project

The World Health Organization explicitly connects urban planning with health, well-being, access to services, transport, food, education, healthcare, and broader quality of life. citeturn420922search0turn420922search3

The OECD's city well-being framework includes dimensions such as housing, access to services, walkability, public transport satisfaction, health, environment, personal safety, and community satisfaction. citeturn420922search4

UN-Habitat's Quality of Life Initiative provides a contemporary multidimensional framework for urban quality of life and emphasizes combining objective indicators with residents' perceptions. Its pilot framework spans domains including basic services and mobility, culture and recreation, economy, education, environment, governance, health, housing, and social cohesion. citeturn420922search11turn420922search14

These references could be used on the website's “Research Context / Further Reading” area, but they should not be presented as sources that Wenrui necessarily consulted during the 2023–2024 project unless confirmed.

## 3.9 Publicity / community engagement

The resume states that 2+ publicity campaigns were organized around food safety and anti-fraud education. [Resume: Projects]

No campaign posters, copy, photographs, outcome metrics, attendance counts, or social-media material were supplied. These should be added later if the website will highlight the community-impact portion of the project.

## 3.10 Physical / tangible artifacts

Currently confirmed:
- custom map visualization;
- front-end implementation;
- community-facing campaign activity.

Potential future artifacts to add:
- research report;
- questionnaire form;
- interview protocol;
- anonymized survey results;
- data visualizations;
- map screenshots;
- campaign posters;
- photographs;
- team documentation;
- presentation deck.

## 3.11 Original presentation findings and interdisciplinary framing

The project was motivated by the contrast between Shanghai's rapid development and the persistence of older residential neighborhoods. The team was concerned that residents in older neighborhoods might experience lower quality of life because of issues such as safety hazards, management challenges, and other neighborhood-level drawbacks.

The research framing was that improving residents' happiness in older neighborhoods could contribute to improving quality of life in Shanghai.

### Early questionnaire sample
The original presentation reports an early questionnaire sample size of **48 people**. The collected information was analyzed from multiple disciplinary perspectives and shared among team members.

Examples cited in the presentation:
- From a psychology perspective, respondents appeared to have relatively limited opinions about greening, suggesting that greening was not a major perceived influence for this sample.
- From an economics perspective, respondents appeared more likely to consider income and expenditure in daily life.

The dossier should preserve the 48-person figure as the historical presentation figure and separately retain the resume's 20+ questionnaires/interviews figure rather than silently merging the two counts.

### Amenity-awareness finding
The presentation reports an average value of **6.75 / 10** for how well respondents knew the stores and amenities near their neighborhoods.

This finding helped motivate a simple neighborhood-accessibility visualization: a map divided into **5-, 10-, and 15-minute walking zones** to help residents understand which facilities could be reached within different walking distances.

### Intended user groups
The presentation explicitly considered three broad age groups:

- **Middle-aged residents:** simplify understanding of surrounding conditions and daily services.
- **Older residents:** simplify map interaction so nearby facilities are easier to understand and use.
- **Younger residents:** use walking-minute filters to explore nearby amenities more freely.

These statements represent **design intent**, not validated user outcomes. No formal user testing was conducted.

## 3.12 Community interventions

The project included multiple non-software interventions developed from the interdisciplinary analysis.

### Food / leftovers awareness
The team observed that eating leftovers was a common issue, particularly among older community members, and connected this behavior to concerns about food poisoning and other health problems.

A poster was designed to:
- explain potential harms associated with leftovers;
- address rumors or misconceptions about leftovers;
- distribute the information among older communities near SHSID.

### Anti-fraud publicity
The project also addressed fraud prevention among older residents.

Historical presentation figures report:
- **60.42%** had not been exposed to anti-fraud publicity;
- among people who had received such publicity, **63.16%** indicated that the publicity had not worked for them.

The team's response was to publicize fraud-prevention information and improve residents' ability to recognize fraud and protect their property.

Feedback collected afterward indicated that some residents considered the event informative and that the short lecture helped clarify information they had previously been uncertain about.

### Psychology / community dissemination
The psychology-oriented discussion emphasized awareness among older residents, reducing social loafing, and distributing responsibility. A future idea was to contact neighborhood associations and other organizations to expand publicity efforts.

These interventions should remain separate from the web application in the dossier because they represent different intervention types within the same interdisciplinary project.

## 3.13 Evidence and validation boundary

No formal user testing of the interactive map was conducted. Therefore, public-facing language should describe the map as a **prototype / digital intervention** designed around identified needs, not as a user-validated product.

The project materials do not establish that the map or publicity interventions caused a measurable long-term improvement in residents' quality of life. The strongest defensible claim is that the project **identified neighborhood-level concerns and developed digital and community-oriented interventions intended to improve access to information and awareness.**

## 3.14 Open questions for Wenrui

1. What specific quality-of-life problem in Shanghai motivated the study?
2. What population or neighborhood was studied?
3. What were the main questionnaire/interview findings?
4. Which findings directly influenced the website categories?
5. How was “walking distance” defined and measured?
6. Was the 5/10/15-minute radius based on walking speed, map data, or manual categorization?
7. What role did each team member play, and what did you personally implement?
8. What technical challenges did the map present?
9. What was the outcome of the food-safety and anti-fraud campaigns?
10. Is there a final research report or presentation from the project?

---

# 4. Research: Social Futures Lab — Case Similarity, Relevance, and Principle Agreement

## 4.1 Canonical record

**Role:** Undergraduate Research Assistant

**Timeline:** April 2026 – Present

**Organization:** Social Futures Lab, Paul G. Allen School, University of Washington

**Resume-supported work:**
- Analyzed participant survey data on case similarity, relevance, and principle agreement.
- Processed CSV datasets using pandas.
- Constructed normalized principle vectors for case analysis.
- Investigating how agreement on principles affects perceived relevance between cases.

## 4.2 Research question as currently evidenced

The work investigates a relationship among three concepts:
- similarity between cases;
- perceived relevance between cases;
- agreement on principles.

The current resume supports the statement that the research asks how agreement on principles affects perceived relevance between cases. [Resume: Experience]

## 4.3 Technical workflow

The source currently establishes:
1. participant survey data is collected;
2. CSV datasets are processed with pandas;
3. principles are represented as normalized vectors;
4. those vectors are used for case analysis;
5. perceived relevance is studied in relation to principle agreement.

The current upload does not include the actual dataset, notebook, statistical model, normalization formula, or visualization, so those details must be added from the research artifacts before publication.

## 4.4 Future project documentation to collect

- research question statement;
- hypothesis;
- survey design;
- sample size;
- variable definitions;
- vector representation;
- normalization formula;
- similarity metric;
- statistical tests/models;
- findings;
- plots;
- limitations;
- whether the study is under review or publication;
- authorship/contribution boundaries.

## 4.5 Website positioning

This experience is particularly valuable as evidence of being able to translate abstract research questions into a reproducible data-analysis workflow. It should remain clearly separated from the course-allocation project because both involve “principles” and “preferences” at different conceptual levels but are unrelated pieces of work.

## 4.6 Confirmed data-transformation code

Wenrui provided the actual pandas script used in the research workflow. The script:

- reads a CSV file;
- identifies response columns by the `R` prefix;
- preserves non-response columns as metadata;
- splits comma-separated ethical-principle labels;
- counts principle occurrences with Python's `Counter`;
- normalizes each principle count by the total number of extracted principles for that row;
- constructs a shared ordered principle space across the dataset;
- stores both individual principle dimensions and a JSON-encoded ordered principle vector;
- writes the resulting dataset to a new CSV file.

The normalization is of the form:

\[
 v_p = \frac{count(p)}{\sum_j count(p_j)}
\]

for each principle `p` represented in a row.

This is concrete evidence for the resume statement that the project involved **constructing normalized principle vectors**.

## 4.7 Division of tools

The current confirmed workflow is split across tools:

**Python / pandas:** data parsing, principle extraction, counting, normalization, vector construction, and output generation.

**Google Sheets:** subsequent analysis using spreadsheet formulas.

**R:** regression analysis shared with the research team.

This should be represented accurately as a mixed practical research workflow rather than as an entirely Python-based analysis pipeline.

## 4.8 Confirmed statistical analysis and preliminary result

For each principle, the research team fitted a linear model of the form:

`lm(principle_X_agreement ~ principle_X_count, data = principle_counts)`

The stated interpretation was:
- `principle_X_count` = independent variable, representing the count/frequency of the principle;
- `principle_X_agreement` = dependent variable, representing agreement/preference toward that principle;
- the linear model provides a slope coefficient and statistical significance information.

### Current result
The shared result was that **principle preferences / agreement did not appear to be affected by principle counts for any of the principles examined**.

This should be written cautiously as a null / non-detect finding from the current models, not as proof that principle frequency can never influence agreement.

### Scope boundary
No confirmed result is currently available about the broader relationship between **case similarity** and **case relevance**, or about whether principle agreement ultimately predicts perceived relevance between cases. Those questions remain part of the ongoing research.

## 4.9 Research contribution

The current evidence supports a contribution narrative centered on **data transformation and empirical analysis**:

**Ethical case survey → structured CSV → principle extraction → normalized vectors → statistical analysis → interpretation of a null result.**

The public portfolio should not claim ownership of the lab's ethical-principle taxonomy unless that is later confirmed. The current materials indicate that the principle scheme was provided by the research setting and that Wenrui's role was to operationalize the data for analysis.

## 4.10 Open questions for Wenrui

1. What is the formal research question/hypothesis in the lab's own terminology?
2. What does a “principle vector” represent mathematically?
3. How is agreement between two vectors measured?
4. What was the sample size and survey population?
5. What preliminary result have you observed so far?
6. What part of the analysis is specifically your contribution?
7. Are there research artifacts that can be published or summarized publicly?

---

# 5. Internship: Software Engineer Intern — Thermo Fisher Scientific

## 5.1 Canonical record

**Role:** Software Engineer Intern

**Company:** Thermo Fisher Scientific

**Location:** Shanghai, China

**Timeline:** June 2026 – Present

**Resume-supported responsibilities:**
- Integrated YOLO26-based object detection with ROS2 robot-arm motion control, supporting repetitive laboratory sample handling through machine vision.
- Performed black-box workflow testing for Chinese localization of DNA-sequencing software 3500Dx.
- Reverse-engineered Qantis EDXRF workflows, helping UI designers clarify page transitions and structures.
- Onboarded a new intern through software training, virtual-machine setup, and troubleshooting, supporting a faster transition to independent testing.

## 5.2 Technical area: machine vision + robotics

The strongest technically differentiating work item is the integration of computer vision and robot-arm control.

The resume establishes that YOLO26 and ROS2 were applied to repetitive laboratory sample handling. The subsequently supplied `rosmaster_new` working directory adds direct implementation evidence for the vision and integration layer:
- three successive object-detection datasets and trained checkpoints;
- a robot-camera data-capture utility;
- reproducible training and held-out test scripts;
- a perception-only live monitor;
- a staged RGB-D perception-to-action workflow for selecting, picking, and placing laboratory tubes;
- runtime logs, evaluation plots, annotated comparisons, and saved workflow snapshots;
- camera-recovery and ROS2 safety checks developed around real hardware behavior.

The local artifacts identify an NVIDIA Jetson execution environment and an Orbbec DaBai DCW2 RGB-D camera. The code integrates an existing ROS2 robot platform through inherited arm, chassis, kinematics, and camera interfaces. The exact commercial robot model is suggested by local package naming but is not independently confirmed, so public copy should continue to say **ROS2 mobile manipulator / robot-arm platform** unless Wenrui confirms the model and disclosure approval.

The implementation now documents the previously missing detection classes, RGB-D position handling, staged target locking, odometry-guided chassis alignment, inverse-kinematics and forward-kinematics checks, motion limits, and stop behavior. Exact calibration offsets, device identifiers, internal paths, and employer source code remain outside the public-writing layer.

External context: Ultralytics currently documents YOLO26 as an end-to-end detection architecture with an inference path designed to avoid non-maximum suppression and to support edge deployment. citeturn577732search0turn577732search4

The use of YOLO26 in the portfolio should remain scoped to dataset development, model fine-tuning, evaluation, deployment, and perception-to-action integration rather than implying ownership of the underlying model architecture or the inherited low-level robot-control stack.

## 5.3 Technical area: localized software testing

The resume describes black-box workflow testing of the Chinese localization for Applied Biosystems 3500Dx DNA-sequencing software. [Resume: Experience]

Thermo Fisher's official materials describe the 3500 Dx series as genetic analyzers supporting Sanger sequencing and integrated analysis/software workflows. citeturn577732search7turn577732search9

The website can therefore contextualize the testing environment as scientific instrumentation software, but should not reveal proprietary screens, internal workflows, customer data, or confidential defects unless they are approved for disclosure.

### Test-oriented story to develop later
Potential structure:
- localization requirements;
- workflow coverage;
- black-box methodology;
- observed classes of defects;
- reproducibility;
- reporting/escalation;
- impact on user-facing quality.

The current files do not contain those details.

## 5.4 Technical area: workflow reverse engineering / UX support

The resume states that Qantis EDXRF workflows were reverse-engineered to help UI designers clarify page transitions and structures. [Resume: Experience]

This can be presented as a cross-functional engineering contribution: understanding a technical workflow deeply enough to communicate its state transitions and interaction structure to designers.

However, the actual Qantis product documentation or workflow diagrams are not included in the uploaded materials. The website should avoid disclosing proprietary screen details unless approved.

## 5.5 Technical area: onboarding and operational enablement

The resume reports training a new intern, configuring a virtual machine, and troubleshooting setup issues to accelerate the transition to independent testing. [Resume: Experience]

This is useful evidence of engineering effectiveness beyond coding: environment setup, knowledge transfer, debugging, and team enablement.

## 5.6 Potential recruiter-facing themes

- Applied computer vision to a real laboratory automation workflow.
- Worked across robotics, software testing, scientific instrumentation, and design communication.
- Operated in an environment where reliability and workflow correctness matter.
- Supported another engineer's onboarding through practical technical enablement.

These are supported synthesis statements. The detector has source-backed evaluation metrics, and Wenrui reports an approximately 98% overall robot-workflow success rate during testing. The latter is currently an author-confirmed result rather than an artifact-backed benchmark; trial count, test conditions, and cycle-time records still require documentation.

## 5.7 Confidentiality boundary

This section should be treated as potentially sensitive because the work concerns proprietary commercial software and laboratory workflows. Public portfolio content should prefer:
- high-level architecture;
- personal responsibility;
- non-sensitive technical principles;
- measurable public-safe outcomes.

It should avoid:
- internal URLs;
- unreleased screenshots;
- source code belonging to the employer;
- customer information;
- internal bug identifiers;
- proprietary workflow logic;
- credentials or environment details.

## 5.8 YOLO + ROS2 implementation — detailed contribution

The robot task is **automated laboratory tube handling**: detect tubes, grasp them, and place them into designated openings in a tube rack.

### Team history
Another intern initially investigated candidate machine-vision strategies, including a point-cloud-based approach, and trained several early YOLO versions. The project ultimately used YOLO, after which Wenrui took over the vision work and retrained the detector.

### Evidence package reviewed

The supplied `rosmaster_new` directory contains 2,688 visible files. Most are images, labels, logs, model checkpoints, and a project-local dependency cache rather than authored source. The authored/project-specific layer includes six principal Python utilities, three dataset versions, three trained best checkpoints, four held-out evaluation runs, runtime logs, camera-recovery utilities, and saved real-hardware workflow frames.

This evidence is substantially stronger than the resume alone. It supports concrete claims about dataset construction, YOLO26 fine-tuning, detector evaluation, live RGB-D perception, ROS2 integration, staged user confirmation, target reacquisition, odometry-aware chassis movement, IK/FK preflight, and stop/failure handling.

### Contribution boundary

Wenrui's project-specific work is represented by the following pipeline:

**Robot-camera data collection → dataset-export validation → YOLO26 fine-tuning → held-out evaluation → live RGB-D inference → target selection and stabilization → coordinate handling → ROS2 chassis/arm integration → pickup and placement.**

The end-to-end test class extends an existing `TubePutNode`, and the source explicitly treats the camera, chassis, arm-kinematics service, and low-level tube code as existing interfaces. The strongest defensible authorship statement is therefore **dataset, model, perception, workflow, integration, calibration, verification, and safety-layer engineering using the available robot interface**. It should not claim authorship of the robot firmware, servo driver, underlying kinematics service, camera driver, or YOLO26 architecture.

### Data-collection workflow

`capture_tube_dataset_images.py` is a dedicated robot-camera capture tool rather than a manual collection folder. It:
- subscribes to the ROS2 color stream;
- serves a localhost 640 × 480 preview;
- moves the camera arm to a repeatable initial pose;
- provides bounded left/right/up/down camera-arm adjustments;
- prevents capture while the arm is moving;
- saves clean timestamped JPEG frames without browser overlays for later labeling in Roboflow.

Three dated capture folders contain **155 raw robot-camera images**: 38 from the first session, 51 from the second, and 66 from the third. These files are separate from the exported datasets, so they should be described as the available raw capture pool rather than as 155 unique training images.

### Dataset evolution

The local Roboflow exports document three successive dataset versions:

| Dataset | Classes | Train / validation / test images | Total labeled instances |
|---|---|---:|---:|
| V1 | `empty_hole`, `rack`, `tube` | 72 / 9 / 5 | 1,573 |
| V2 | V1 + `tube_cap` | 108 / 19 / 10 | 3,047 |
| V3 | `empty_hole`, `rack`, `tube`, `tube_cap` | 158 / 30 / 15 | 4,729 |

V3 contains 203 exported images and 4,729 labeled objects: 3,657 `empty_hole`, 184 `rack`, 446 `tube`, and 442 `tube_cap` instances. The progression shows two meaningful iterations: adding `tube_cap` as a separate manipulation target in V2, then expanding all splits and all four classes in V3.

The V3 distribution is highly imbalanced toward `empty_hole`, and its held-out test split contains only 15 images. These constraints must accompany any published metric. The data YAML files identify the Roboflow exports as CC BY 4.0, but public reuse of images showing an employer laboratory still requires a separate disclosure and privacy review.

### Training and reproducibility

`yolo26_train_tube_rack_hole.py` fine-tunes a generic COCO-pretrained YOLO26s checkpoint rather than starting from another custom tube model. Before training, it checks:
- the declared class order and class count;
- image/label pairing for each split;
- class presence and valid class IDs;
- normalized coordinate ranges for boxes or polygons;
- Roboflow path resolution, including repair of parent-relative split paths.

The recorded runs use Ultralytics 8.4.55 on the Jetson GPU with 100 epochs, 640-pixel input, batch size 1, zero data-loader workers, patience 30, AMP, deterministic seed 0, and the recorded default augmentation configuration. The fixed batch and disabled cache are deliberate shared-memory safeguards for the embedded Jetson environment. After training, the script exports the best checkpoint only after reloading it and verifying the expected class order.

Recorded training runs:

| Version | Completed epochs | Training time | Best validation mAP50–95 | Best epoch |
|---|---:|---:|---:|---:|
| V1, three classes | 100 | 55.8 min | 0.885 | 94 |
| V2, four classes | 100 | 91.7 min | 0.897 | 76 |
| V3, four classes | 100 | 103.1 min | 0.906 | 87 |

### Held-out detector evaluation

`yolo26_test_tube_rack_hole.py` is evaluation-only: it does not train a model, start the robot, or command motion. It validates the selected dataset, runs YOLO validation on the `test` split, writes a machine-readable summary, saves aggregate curves/confusion matrices, and creates ground-truth/prediction/side-by-side images for every test frame.

| Version | Test images / labels | Precision | Recall | mAP50 | mAP50–95 | Inference time |
|---|---:|---:|---:|---:|---:|---:|
| V1 | 5 / 96 | 0.975 | 0.988 | 0.994 | 0.935 | 76.3 ms/image |
| V2 | 10 / 220 | 0.977 | 0.952 | 0.974 | 0.919 | 75.4 ms/image |
| V3 | 15 / 352 | 0.977 | 0.974 | 0.979 | 0.926 | 67.0 ms/image |

The V3 result is the most relevant current detector record because it covers all four workflow classes and the largest local test set. It supports a cautious statement such as: **the latest four-class model reached 0.926 mAP50–95 on a 15-image local held-out test split**. Precision, recall, and inference timing are aggregate detector metrics, not evidence of robot grasp/placement success or production generalization.

One duplicate V1 test run reports approximately 1.3 seconds of inference per image while otherwise reproducing the same metrics. Because the adjacent V1 run reports 76.3 ms/image, this value appears environment- or warm-up-dependent and should not be used as the representative latency without further controlled benchmarking.

### Live perception layer

`yolo26_realtime_tube_rack_hole.py` provides a separate perception-only monitor. It verifies the local Ultralytics version and model class names, subscribes to the robot color camera, performs latest-frame inference, and reports detections, inference time, FPS, and dropped-frame count in a localhost browser view. When inference is busy, a newer frame replaces the pending frame instead of allowing a stale queue to accumulate. The script explicitly publishes no arm or chassis commands, making it a safer diagnostic layer for model and camera validation before motion is enabled.

### End-to-end workflow architecture

`yolo_test_new_with_realphoto.py` is a 5,209-line staged RGB-D workflow built around the inherited robot interfaces. Its state machine uses `tube`, `tube_cap`, `rack`, `empty_hole`, `placing`, and `complete` phases. A concise technical sequence is:

1. Detect only the class relevant to the current phase.
2. Let the operator click a tube in the browser and require stability across multiple frames.
3. Associate the overlapping `tube_cap` detection with that confirmed tube so the pickup point is not silently taken from a neighboring tube.
4. Use RGB-D depth and the existing camera/end-effector/robot transformation interface to obtain a robot-frame target.
5. Align the mobile chassis using odometry, then reacquire and re-confirm the target after movement.
6. Preflight the arm path with inverse kinematics and forward-kinematics verification before sending motion.
7. Pick the tube, preserve its held state while searching for a rack, and restrict hole candidates to the confirmed rack.
8. Let the operator select an empty hole, re-lock it after chassis corrections, then execute a verified placement path and release.

This is not simply “YOLO sends a coordinate to a robot.” The code treats perception as a staged, stateful process in which object identity, camera pose, target stability, chassis displacement, and arm reachability are checked repeatedly before action.

### Position handling and target identity

The source distinguishes three forms of target handling:
- the initial `tube` selection is a two-dimensional parent-object confirmation;
- the overlapping `tube_cap` uses measured RGB-D depth and the existing world-pose transform for physical pickup;
- `empty_hole` is projected onto the known rack-hole Z plane, then kept within the confirmed rack region.

Target stability is based on multiple recent frames, with limits on center drift and depth spread. The browser click includes the exact displayed frame number so selection is matched against the detections that produced that frame rather than a newer image. After chassis motion, the code transforms the remembered target by measured odometry, projects the expected position back into the image, and uses tighter pixel/3D gates to reacquire the same cap or hole. If the match is ambiguous or resembles a neighboring hole, the workflow stops instead of silently changing targets.

The exact camera-to-robot calibration implementation is inherited and not present in this supplied folder. Public copy may accurately say **RGB-D detections were converted into robot-frame targets through the available calibrated robot interface**, but should not claim that Wenrui authored the underlying camera extrinsics or kinematics service unless separately confirmed.

### Motion planning and iterative calibration

The project contains evidence of repeated physical calibration rather than a single nominal motion command:
- bounded camera-arm search poses scan left/right and up/down for targets;
- chassis approach is constrained by speed, travel, timeout, and odometry freshness;
- pickup and placement targets must lie inside a tested radial, lateral, height, and arm-reach workspace;
- close-up detections verify that chassis movement placed the target in the intended arm-motion band;
- local grasp and rack-hole offsets record empirical corrections from observed physical error;
- the pickup/placement path was revised from sparse joint-space segments to dense Cartesian waypoints after sideways bow was observed near a rack hole.

The current insertion/extraction implementation samples the Cartesian line every 2.5 mm. Each waypoint is solved and checked before motion, with 3 mm XY tolerance, 3 mm Z tolerance, 2-degree pitch tolerance, and up to three bounded correction attempts. These values are useful internal evidence of engineering rigor; public publication of exact motion parameters should be approved separately.

### Safety and failure handling

The local source includes multiple explicit protections:
- perception-only is the default; physical motion requires both a command-line flag and browser authorization;
- the control monitor binds to loopback for local/SSH-forwarded access;
- STOP, Q, and ESC wake active waits, send repeated zero-velocity commands to the chassis, and supersede an in-progress arm trajectory with an estimated-position hold command;
- stale odometry stops motion, attempts bounded recovery while repeatedly commanding zero velocity, and aborts if fresh feedback does not return;
- chassis motion is refused unless the ROS graph exposes exactly one unambiguous base command subscriber and odometry publisher;
- speed, travel, timeout, confidence, search range, reach, height, gripper, and approach parameters are range-validated before runtime;
- target reacquisition, workspace validation, and IK/FK preflight can all block arm motion;
- tube-held state prevents unsafe gripper or return-to-initial-pose assumptions.

These are software-layer safeguards around an experimental robot workflow, not a certified industrial safety system. Portfolio wording should use **safety checks**, **guardrails**, or **fail-closed behavior**, not “safety-certified.”

### Camera/runtime reliability work

Logs identify intermittent RGB-D camera/device stability as a real engineering concern. Wenrui reports that the remaining unsuccessful runs are associated with occasional camera or other hardware failures, but the underlying cause has not yet been isolated. The project includes both a Python USB-port power utility and a shell recovery script that validate the intended camera branch, power-cycle or rebind only that device path, verify re-enumeration, and avoid rebooting the Jetson or disrupting unrelated USB devices. These recovery measures address symptoms and restore the device; they should not be described as having resolved the root cause. Public copy can summarize this as **targeted camera recovery and runtime troubleshooting for an embedded ROS2 deployment**; exact serial numbers, hub topology, and internal launch paths should not be disclosed.

### Saved evidence and what it proves

The working directory contains:
- three exported datasets and three trained best checkpoints;
- training curves and configuration files for each run;
- four test summaries plus per-image ground-truth, prediction, and comparison renders;
- 155 raw robot-camera captures;
- 1,358 non-empty saved workflow JPEGs, including paired raw/annotated frames and target-lock stages;
- 43 runtime-log files and additional camera/kinematics logs.

The workflow snapshots cover stages such as startup, tube confirmation, pre-drive target lock, post-drive reacquisition, rack confirmation, empty-hole selection, and repeated alignment corrections. They demonstrate sustained iteration on real hardware and provide strong material for a redacted process drawer. They do **not** by themselves establish how many complete tube-transfer cycles succeeded. Eight zero-length JPEG artifacts are also present and should be excluded from any public gallery.

### Result status and remaining validation

The prior statement that “no formal detection metric was recorded” is now superseded. Detector precision, recall, mAP, inference timing, confusion matrices, and per-image comparisons are available for all three model versions.

Wenrui additionally confirmed an **approximately 98% overall success rate for the robot workflow during testing**. The remaining approximately 2% of unsuccessful runs were associated with intermittent camera or hardware faults whose root cause could not yet be determined.

This 98% figure is a user-confirmed operational result, not a value reconstructed from the supplied output folders. The current materials do not record:
- the exact number of attempted and successful cycles;
- the formal definition of a successful run;
- separate grasp and placement success rates;
- average handling time per tube;
- failure counts separated by camera, hardware, perception, alignment, grasp, or placement stage;
- controlled robustness across lighting, viewpoints, racks, tube types, or repeated sessions.

Public copy may say **“approximately 98% reported workflow success during real-hardware testing”** after employer approval. It should not call this “98% model accuracy,” imply a controlled production benchmark, or attribute every residual failure conclusively to the camera until the hardware root cause is isolated.

### Public-safe extraction boundary

Potentially public-safe after employer review:
- the four object classes;
- the high-level RGB-D / YOLO26 / ROS2 architecture;
- dataset-version and aggregate held-out detector metrics;
- general target-stability, reacquisition, IK/FK verification, and fail-closed design principles;
- redacted training curves, confusion matrix, and selected images that reveal no proprietary environment or labels.

Keep internal unless explicitly approved:
- source code or copied implementation logic;
- exact calibration files and offsets;
- serial numbers, USB topology, internal paths, launch names, ROS domain details, and device/network configuration;
- unredacted laboratory imagery;
- any employer-owned workflow, unreleased interface, customer/sample information, or internal defect record.

## 5.9 3500Dx Chinese localization — dynamic workflow testing

The work on 3500Dx involved **black-box testing of dynamic workflows** in the Chinese-localized software.

The tests were based on predefined test cases, but the test cases were not always sufficiently self-explanatory. Wenrui therefore first became familiar with the software, communicated with relevant stakeholders to understand ambiguous test cases and expected behavior, and then executed the workflows.

A defensible workflow description is:

**Receive test case → understand product workflow → clarify expected behavior → execute dynamic sequence → observe state/page transitions → identify discrepancies → communicate findings.**

This should be framed as a combination of **product understanding, test-case interpretation, and dynamic workflow validation**, rather than as static translation proofreading.

## 5.10 Qantis / WinTrace workflow reverse engineering

The Qantis EDXRF work involved understanding the original **WinTrace** software and mapping its interaction structure in **Miro**.

The key artifact was a workflow diagram in which each interface was connected to the actions that caused transitions to other interfaces, for example:

**Current interface → button/action → resulting interface**

The purpose was to help UI designers understand the existing workflow and clarify page-transition structure for redesign.

This contribution should be described as **workflow reverse engineering / state-transition mapping**, not as modification of the proprietary product itself.

## 5.11 New-intern onboarding

The onboarding work included:
- software training;
- virtual-machine setup;
- installation/configuration of the relevant environment;
- troubleshooting setup and runtime problems;
- guidance on software/testing workflows.

The stated practical objective was to help the new intern move more quickly toward independent testing.

This experience is useful evidence of both **technical enablement** and **knowledge transfer**.

## 5.12 Contribution separation across the internship

For a recruiter-facing portfolio, the four contributions should remain distinct:

1. **YOLO + ROS2:** primary coding and systems-integration work.
2. **3500Dx:** primary time investment in black-box dynamic workflow testing and test-case interpretation.
3. **Qantis / WinTrace:** reverse engineering of interaction flow and communication of state transitions to UI designers.
4. **Onboarding:** technical environment setup, troubleshooting, software training, and knowledge transfer.

This separation prevents the internship from appearing as a single undifferentiated “software engineering” task and more accurately reflects the breadth of responsibilities.

## 5.13 Resolved and open verification items

1. **Substantially resolved from artifacts:** the local project-specific layer covers camera-data collection, dataset validation, YOLO26 fine-tuning/testing/deployment, browser interaction, staged target logic, ROS2 integration, calibration, chassis alignment, arm-path preflight, and runtime guardrails. The inherited low-level robot interfaces remain outside the authorship claim.
2. **Resolved:** the final detector uses `empty_hole`, `rack`, `tube`, and `tube_cap`.
3. **Partially resolved:** the workflow uses RGB-D depth, an inherited camera/end-effector/robot transform, robot-frame target poses, odometry updates, and IK/FK verification. Authorship and public disclosure of the underlying calibration/extrinsics remain unconfirmed.
4. **Partially resolved:** the artifacts identify a Jetson environment and Orbbec DaBai DCW2 RGB-D camera. The exact robot model and whether either hardware name may be published still require confirmation.
5. **Partially resolved:** the code documents practical challenges in target identity after movement, physical alignment, joint-space path bow, stale odometry, duplicate ROS base endpoints, and camera stability. Wenrui confirmed that the residual unsuccessful runs involve intermittent camera or hardware faults, but their root cause remains unresolved.
6. **Resolved at reported-result level:** the latest four-class model has held-out precision, recall, mAP, and timing records, and Wenrui reports approximately 98% overall robot-workflow success. **Still open for formal benchmarking:** the trial count, success criterion, controlled conditions, per-stage results, and handling-time records are unavailable.
7. **Still open:** for 3500Dx testing, what classes of localization/workflow discrepancy can be described safely?
8. **Previously established at role level:** the Qantis artifact was a WinTrace interface/state-transition map; exact publishable examples remain open.
9. **Still open:** what onboarding materials, if any, can be shown or summarized?
10. **Still open and mandatory:** which code-derived architecture details, metrics, plots, and redacted images have employer approval for public use?

---

# 6. Project in Progress: Untangle / Present Moment — Guided Wellbeing Reflection

## 6.1 Canonical project record

**Working project name:** Untangle

**Current demo title:** Present Moment

**Status:** Interactive prototype / feedback in progress

**Format:** Browser-based guided reflection exercise

**Public demo:** `https://alinaaaw.github.io/untangle-demo/`

**Current contribution:** Independent concept development, interaction design, and prototype implementation.

**Reported foundation:** UW `EDUC 215` course content and independent reading related to wellbeing. Exact course details, concepts, and references have not yet been supplied for citation.

**Current feedback stage:** Wenrui is collecting suggestions from professors and teaching staff. This establishes an active feedback process, not formal UW sponsorship, faculty approval, or evidence of product effectiveness.

**Timeline:** In progress; exact start date not yet confirmed.

## 6.2 Confirmed project purpose and positioning

The prototype explores how a short digital exercise might help a user externalize current worries, distinguish what belongs to the past or future from what is happening now, identify an emotional response, and decide whether a concrete action is available.

The intended benefit is general reflection and support for everyday wellbeing. Any reduction in anxiety remains a **design goal**, not a demonstrated outcome. The project should not be described as diagnosing, treating, or preventing a mental-health condition.

## 6.3 Evidence reviewed

The current record combines:
- Wenrui's confirmation that an interactive demo already exists;
- Wenrui's confirmation that feedback is being collected from professors and teaching staff;
- the public `Untangle` demo inspected at `https://alinaaaw.github.io/untangle-demo/`;
- the project-planning record in `TODO.md`, including scope, privacy, safety, attribution, and future-testing considerations.

The live prototype establishes the current interaction structure and language. It does not establish usability, psychological benefit, clinical validity, long-term engagement, or professor endorsement.

## 6.4 Confirmed interactive workflow

### Stage 1 — Externalize current concerns

The opening screen presents the exercise as approximately ten minutes and asks the user to write down worries, fears, or sources of stress. Optional sample concerns allow the flow to be explored without entering original text.

### Stage 2 — Place each concern in time

The user sorts each concern into **Past**, **Right Now**, or **Future**. When a concern is placed in **Right Now**, the prototype prompts the user to separate it into a specific past event and/or a feared future outcome. This supports the broader design idea that relatively little may be occurring in the exact present moment, even when a concern feels current.

### Stage 3 — Identify the emotional response

For each concern, the prototype asks what the user is feeling. The flow supports a core emotion, a more specific emotional label, and the location where the feeling is noticed in the body.

### Stage 4 — Check agency

The prototype asks:
- whether the situation can be changed;
- whether the user can act on it now;
- what one concrete action could be taken today when immediate action is available.

This stage separates concerns with an actionable next step from concerns that cannot be changed or acted on immediately.

### Stage 5 — Release or retain without forcing closure

Concerns without an immediate action move into a release sequence. The prototype asks the user to notice the feeling, distinguish it from the situation itself, and choose either to let it go for the moment or to indicate **not yet**. The latter path explicitly avoids requiring the user to force release.

### Stage 6 — Close with a short summary

The final screen summarizes how many concerns were released and how many actions remain. Any concrete actions entered earlier are carried into the closing view.

## 6.5 Interaction and implementation observations

The current prototype demonstrates:
- a multi-screen, progressive-disclosure flow rather than one long form;
- card-based concern entry and temporal sorting;
- contextual follow-up prompts for concerns placed in the present;
- hierarchical emotion labeling and body-awareness prompts;
- conditional branching based on perceived agency;
- a release queue for concerns without an immediate action;
- a closing summary that distinguishes released concerns from retained actions;
- client-side interaction logic sufficient for a working public demo.

The current evidence does not yet establish the final technology stack, repository structure, persistence model, accessibility coverage, analytics, or whether any user-entered text is stored beyond the active browser session.

## 6.6 Current feedback and iteration stage

The project has moved beyond concept planning into an interactive prototype. Wenrui is currently collecting feedback from professors and teaching staff before deciding the next revision and broader public scope.

The current portfolio language may accurately say:
- an interactive prototype exists;
- the main reflection flow has been implemented;
- feedback is in progress;
- the next revision will refine the prompts, emotional pacing, exit paths, and safety boundaries.

The portfolio should not say that a professor, course, department, or the University of Washington has approved, partnered on, validated, or endorsed the product unless that scope is later confirmed explicitly.

## 6.7 Safety, privacy, and evidence boundary

The prototype deals with worries, stress, emotions, and personal reflection. Public and product-facing language should therefore preserve the following boundaries:
- position the exercise as general educational or self-reflection support;
- do not present it as diagnosis, treatment, crisis support, or a substitute for professional care;
- do not claim that the prototype reduces anxiety without appropriate evidence;
- provide a clear way to pause or exit when a user does not want to continue;
- define how crisis or high-distress situations should be redirected before broader testing;
- verify data storage, deletion, privacy, and consent behavior before collecting identifiable or sensitive information;
- evaluate usability and experience separately from psychological or clinical effectiveness.

These are current design and evaluation requirements, not claims that each safeguard has already been implemented.

## 6.8 Current project maturity

The current completed layer is:

**project concept → interactive reflection flow → branching prototype → public demo → professor / teaching-staff feedback collection**

The following layers remain incomplete or unverified:

**confirmed target-user definition → documented source foundation → structured feedback synthesis → revised prototype → usability testing → privacy and safety review → final public scope**

## 6.9 Website-ready positioning

This project is useful evidence of Wenrui's interest in **human-centered design and software development**. It shows an attempt to translate an abstract wellbeing question into a structured interaction, then seek feedback before presenting the prototype as a finished solution.

At the current stage, the final Fax is an appropriate website location because it presents the project as an active investigation and feedback round. The Board may hold its next tests and safety questions. A full Computer project file would become more appropriate after the target user, source foundation, major revisions, and evaluation plan are documented.

## 6.10 Current and missing artifacts

### Currently available
- public interactive demo at `https://alinaaaw.github.io/untangle-demo/`;
- the current multi-stage interaction and interface language;
- the internal planning record in `TODO.md`;
- user-confirmed professor and teaching-staff feedback collection.

### Not yet supplied or confirmed
- source repository and commit history;
- low-fidelity sketches or earlier prototype versions;
- formal project brief and target-user statement;
- exact `EDUC 215` course details and publishable course concepts;
- independent-reading bibliography and annotations;
- written professor / teaching-staff feedback;
- feedback synthesis and resulting design revisions;
- usability-testing plan, participant information, and results;
- privacy, data-retention, crisis-support, and accessibility documentation.

## 6.11 Open questions for Wenrui

1. Is the final project name **Untangle**, **Present Moment**, or another name?
2. What is the exact project start date?
3. What is the official title and term of `EDUC 215`, and which course concepts may be cited publicly?
4. Who is the first intended user, and in what situation should they open the site?
5. Which part of the current flow is the central product idea versus an exploratory prototype feature?
6. What technologies and repository structure are used for the demo?
7. Is user-entered text stored, and if so, where and for how long?
8. Which professors and teaching staff are providing feedback, and may their roles or comments be summarized publicly?
9. What feedback has already been received, and which changes will it produce?
10. What exit, crisis-resource, privacy, and accessibility safeguards are currently implemented?
11. What kind of user testing is planned, and what outcome will be evaluated?

---

# 7. Cross-Project Evidence Map

## 7.1 Hardware / physical computing
Strongest evidence:
- EMG monitoring device;
- Fusion and AutoCAD;
- ESP32;
- Arduino/C++;
- Bluetooth-connected sensing.

## 7.2 Algorithms / mathematical modeling
Strongest evidence:
- Simultaneous Eating / probabilistic allocation;
- Birkhoff decomposition;
- capacity-constrained assignment;
- quantitative satisfaction scoring;
- randomized simulation.

## 7.3 Data / research
Strongest evidence:
- Social Futures Lab survey analysis;
- pandas and normalized vectors;
- mixed-methods Shanghai QoL study.

## 7.4 Web / interaction
Strongest evidence:
- interactive Shanghai map;
- JavaScript state management;
- category and walking-time filters;
- detail-panel interaction;
- multi-stage Untangle wellbeing prototype with temporal sorting, emotional labeling, agency checks, conditional branching, and closing actions.

## 7.5 Applied engineering
Strongest evidence:
- four-class YOLO26 training/evaluation and RGB-D + ROS2 laboratory automation;
- stateful target selection, odometry-guided chassis alignment, target reacquisition, and IK/FK-verified manipulation;
- embedded-runtime diagnostics, camera recovery, and fail-closed motion guardrails;
- black-box testing of scientific software;
- workflow reverse engineering;
- intern onboarding.

## 7.6 Human-centered engineering
Cross-cutting examples:
- usability/accessibility refinement in the EMG project;
- satisfaction as a metric in course assignment;
- community insights and resident-facing mapping in Shanghai;
- localization testing and UI workflow clarification in the internship;
- an interactive wellbeing reflection flow being revised through professor and teaching-staff feedback.

---

# 8. Reference Material Library

The following references are suitable for a portfolio research/reference section. They are **contextual references found during preparation**, not verified evidence of what Wenrui personally read.

## 8.1 Course allocation / fair assignment

1. Bogomolnaia, A. & Moulin, H. (2001). “A New Solution to the Random Assignment Problem.” *Journal of Economic Theory*, 100(2), 295–328. The paper introduces and characterizes the Probabilistic Serial mechanism and discusses ordinal efficiency, envy-freeness, and the contrast with Random Priority. citeturn515935search0

2. Zhan, P. (2023). “Simultaneous eating algorithm and greedy algorithm in assignment problems.” *Journal of Combinatorial Optimization*, 45, 137. The paper provides a modern treatment of Simultaneous Eating and discusses its relationship with Probabilistic Serial. citeturn635696search0

3. Birkhoff–von Neumann theorem references: the theorem characterizes doubly stochastic matrices as convex combinations of permutation matrices. citeturn515935search4turn515935search24

4. Bichler et al. / course allocation literature: randomized scheduling mechanisms have been studied specifically for fair and efficient course-seat assignment, including Probabilistic Serial. citeturn635696search1

## 8.2 EMG / signal processing

1. Published work describing OYMotion EMG filtering: a practical example uses anti-hum notch, low-pass, and high-pass filtering around 50 Hz, 150 Hz, and 20 Hz respectively. citeturn897629search26

2. Recent EMG-processing review material discusses typical 20–500 Hz band-pass ranges, Butterworth filtering, and 50/60 Hz notch filtering while noting the trade-off between interference removal and signal preservation. citeturn897629search7turn897629search2

## 8.3 Urban quality of life

1. WHO, *Integrating health in urban and territorial planning* — connects urban planning with access to transport, food, education, healthcare, environmental quality, and well-being. citeturn420922search7

2. OECD, *Cities in the World* — provides comparative urban well-being framing and highlights quality-of-life dimensions across cities. citeturn420922search1turn420922search36

3. UN-Habitat, *Quality of Life in Cities: Insights from the Quality of Life Initiative Pilot Phase* — a multidimensional framework incorporating both objective indicators and residents' perceptions. citeturn420922search11

4. UN-Habitat, *Quality of Life Initiative Implementation Guidelines* — a practical framework for assessing and improving urban well-being. citeturn420922search9

## 8.4 Computer vision / robotics

1. Ultralytics YOLO26 documentation — useful for contextualizing the object-detection component and discussing end-to-end detection and edge deployment. citeturn577732search0turn577732search4

2. Thermo Fisher 3500 Dx documentation — useful for explaining the scientific-instrument context of the software testing work. citeturn577732search7turn577732search9

## 8.5 Untangle / wellbeing reflection

Wenrui reports that the concept draws from UW `EDUC 215` and independent reading related to wellbeing. The exact course concepts, books, chapters, papers, and personal annotations have not yet been supplied. Future agents should not invent a reference list or imply that the course formally produced or endorsed the prototype.

---

# 9. Artifact Inventory

## 9.1 Provided digital artifacts

### Resume
`Resume_Wenrui_Wu.pdf`
- Current education, experience, projects, skills, and selected quantified accomplishments.
- Primary source for project titles, dates, role descriptions, and high-level outcomes.

### Shanghai QoL website files
`index.html`, `index.css`, `index.js`
- Front-end implementation of the interactive map.
- Provides concrete evidence of interaction architecture, filtering logic, and visual structure.

### Course-allocation algorithm files
`Task01.py`
- Preference generation.

`Task01+02.py`
- Integrated preference generation, probability allocation, deterministic allocation, decomposition, and benchmark scaffold.

`Task02.py`
- Fractional/probability allocation.

`Task03.py`
- Deterministic allocation.

`Task04.py`
- Satisfaction scoring.

### EMG artifact
`EMGFilters.cpp`
- Embedded C++ digital filtering implementation with OYMotion copyright notice.
- Useful as evidence of the signal-processing dependency/implementation used in the EMG project, subject to license and attribution constraints.

### Thermo Fisher robotics working directory
`Project Rosmaster/rosmaster_new/`
- Six principal project-specific Python utilities for image capture, YOLO26 training, held-out testing, perception-only monitoring, end-to-end RGB-D robot workflow, and targeted camera USB recovery.
- Three Roboflow dataset exports spanning 86, 137, and 203 images, with a final four-class taxonomy and 4,729 labeled instances.
- Three trained best checkpoints, training configurations/curves, and four held-out evaluation records.
- Latest four-class test record: 0.977 precision, 0.974 recall, 0.979 mAP50, and 0.926 mAP50–95 on 15 local held-out images / 352 annotations.
- 155 raw robot-camera captures, 1,358 non-empty workflow snapshots, per-image evaluation comparisons, runtime logs, and camera/kinematics logs.
- Strong evidence for the computer-vision, integration, calibration, verification, and runtime-safety layer; inherited robot drivers and low-level interfaces remain outside the personal-contribution claim.
- Employer-owned technical material: use as private source evidence unless individual assets and claims pass disclosure review.

### Untangle public interactive prototype
`https://alinaaaw.github.io/untangle-demo/`
- Working browser-based prototype currently titled **Present Moment**.
- Demonstrates concern entry, temporal sorting, contextual decomposition, emotion and body-awareness prompts, agency checks, action entry, release choices, and a closing summary.
- Public evidence of the current interaction flow, but not evidence of usability, anxiety reduction, clinical value, or professor endorsement.

## 9.2 Missing high-value artifacts

The portfolio dossier would become substantially stronger with:
- project screenshots;
- GitHub repositories;
- commit histories;
- README files;
- CAD renders;
- physical prototype photographs;
- circuit diagrams;
- mobile app screenshots;
- raw/filtered EMG plots;
- classifier performance plots;
- course-allocation benchmark outputs;
- research posters/reports;
- Shanghai map screenshots;
- questionnaire/interview materials;
- campaign materials;
- Untangle source files, earlier prototype iterations, feedback notes, and confirmed reading/course references;
- approved, redacted internship diagrams or architecture sketches suitable for public publication.

---

# 10. Version History / Evolution Tracking Template

Because the supplied files are snapshots rather than a full repository history, actual version chronology cannot currently be reconstructed.

For each project, future agents should maintain the following record:

## 10.1 Version record
- **Version/date:**
- **Problem state:**
- **Implementation state:**
- **Key change:**
- **Reason for change:**
- **Evidence:** commit / screenshot / benchmark / report
- **Observed improvement:**
- **New limitation:**
- **Next planned change:**

## 10.2 Especially relevant for the course-assignment project
Track transitions from:
1. random preference simulation;
2. fractional probability allocation;
3. deterministic allocation;
4. decomposition;
5. scoring/evaluation;
6. runtime optimization;
7. real scheduling extension.

## 10.3 Especially relevant for the EMG project
Track transitions from:
1. hardware concept;
2. first physical prototype;
3. single-channel acquisition;
4. multi-device acquisition;
5. filtering;
6. ESP32 classification;
7. Bluetooth/mobile integration;
8. interface refinement.

## 10.4 Especially relevant for the Shanghai project
Track transitions from:
1. research question;
2. questionnaire/interview collection;
3. insight extraction;
4. map information architecture;
5. category filtering;
6. walking-time filtering;
7. detail interactions;
8. public/community deployment.

## 10.5 Especially relevant for the Untangle project
Track transitions from:
1. initial wellbeing question;
2. first reflection-flow outline;
3. interactive prototype;
4. professor and teaching-staff feedback;
5. prompt, pacing, exit-path, and safety revisions;
6. usability testing;
7. clarified public scope.

---

# 11. What Can Safely Be Published Now vs. What Needs Confirmation

## Safe / strongly supported now
- Project names and dates from the resume.
- Technologies explicitly listed in the resume.
- High-level responsibilities.
- The existence of the course-allocation algorithm components visible in source code.
- The Shanghai map's category and time-filter interaction.
- The OYMotion filter implementation details visible in the uploaded C++ source.
- The stated internship responsibilities at a high level.
- The research assistant's stated analysis tasks.
- The existence and observed interaction structure of the public Untangle prototype.

## Safe with careful wording
- The interpretation that the course project operationalizes a probabilistic/fractional allocation mechanism.
- The interpretation that the Shanghai site is a civic-tech / human-centered artifact.
- The interpretation that the EMG project is a full-stack physical computing system.
- The interpretation that the internship demonstrates cross-functional engineering across CV, robotics, testing, and UX communication.
- The statement that Untangle is an interactive prototype currently collecting professor and teaching-staff feedback, without implying endorsement or demonstrated effectiveness.

## Needs confirmation before publication
- Exact performance numbers beyond those explicitly listed in the resume.
- Exact classifier method/accuracy.
- Exact hardware model and sensor topology.
- Exact research findings.
- Exact scheduler implementation.
- Exact runtime optimization method and benchmark.
- Proprietary internship implementation details.
- Any statement implying authorship of a third-party library or filter implementation.
- Any public GitHub link or repository ownership not shown in the provided files.
- Untangle outcome claims, exact target-user definition, course-source attribution, feedback details, data-retention behavior, or any statement of faculty / UW approval.

---

# 12. Suggested Website Information Architecture

The portfolio should not present every project as a generic “project card.” Instead, each detailed case study can follow a consistent evidence-driven structure while retaining project-specific sections.

## Project landing card
- Title
- One-line value proposition
- Date
- Role
- Technology
- Current status
- Hero artifact/image

## Case-study body
1. **Overview**
2. **Problem / Motivation**
3. **Context**
4. **My Role**
5. **Constraints**
6. **Ideation / Design Decisions**
7. **Technical Architecture**
8. **Implementation**
9. **Testing / Evaluation**
10. **Results**
11. **What I Learned**
12. **Challenges / Failures**
13. **Iteration / Version History**
14. **Physical Artifacts**
15. **Code / Repository**
16. **References / Background Reading**
17. **Future Improvements**

This structure is intentionally more detailed than the final public website may need. An extraction agent can compress it later for different audiences.

---

# 13. Agent Instructions for Future Rewriting

When another agent consumes this dossier, it should:

1. Keep projects completely separate. Never merge course allocation details with Social Futures Lab work or Shanghai QoL research.
2. Treat uploaded artifacts as primary evidence.
3. Preserve uncertainty. “Not provided” is preferable to invented detail.
4. Distinguish personal contribution from team outcomes.
5. Distinguish third-party technology from Wenrui's own engineering work.
6. Distinguish current functionality from planned improvements.
7. Use external references only as context unless personal use of the reference is confirmed.
8. Avoid proprietary internship details without explicit permission.
9. When converting into recruiter-facing language, emphasize problem → technical decision → implementation → evidence → result.
10. When converting into peer-facing technical writing, preserve enough algorithmic and systems detail for another engineer to understand the architecture and trade-offs.
11. Keep Untangle framed as a general wellbeing and self-reflection prototype. Separate implemented interaction behavior from proposed safety measures, unverified outcomes, and feedback still in progress.

---

# 14. Highest-Priority Questions for the Next Revision

To keep the information-gathering process one question at a time, the single highest-value next question is:

**What is the exact problem statement and intended user/use case of your “Monitoring Device for Muscle Usage & Behavior” project, and what do you ultimately want the device to help a person understand or accomplish?**

Once that is answered, the next revision can turn the EMG section from a source-grounded technical summary into a much richer design/ideation narrative without guessing at your motivation.

For the Untangle project, the single highest-value next question is:

**Who is the first intended user, and in what specific moment should that person choose this exercise rather than another form of support?**

---

# 15. Source Citations Used in This Dossier

- Uploaded resume: Wenrui (Alina) Wu, education, experience, projects, and technical skills. fileciteturn0file0L2-L9 fileciteturn0file0L13-L26 fileciteturn0file0L27-L49
- Shanghai map HTML structure and controls. fileciteturn0file2L11-L17 fileciteturn0file2L123-L147
- Shanghai map CSS positioning and UI. fileciteturn0file1L1-L23 fileciteturn0file1L47-L55 fileciteturn0file1L142-L177
- Shanghai map JavaScript filtering/state logic. fileciteturn0file3L1-L23 fileciteturn0file3L25-L58 fileciteturn0file3L210-L238 fileciteturn0file3L242-L303
- Course allocation preference generator. fileciteturn0file4L1-L10
- Course allocation probability matrix and decomposition logic. fileciteturn0file5L1-L16 fileciteturn0file5L35-L86 fileciteturn0file5L195-L218
- Probability allocation task. fileciteturn0file6L1-L18 fileciteturn0file6L22-L54 fileciteturn0file6L75-L103
- Deterministic allocation task. fileciteturn0file7L1-L10 fileciteturn0file7L18-L50 fileciteturn0file7L54-L77
- Satisfaction scoring task. fileciteturn0file8L1-L24
- EMG filter source and copyright / filter implementation. fileciteturn0file9L1-L27 fileciteturn0file9L34-L61 fileciteturn0file9L68-L116 fileciteturn0file9L120-L181 fileciteturn0file9L189-L236
- Local Thermo Fisher robotics artifact package: `Project Rosmaster/rosmaster_new/` — project-specific Python/shell utilities, three dataset exports, three training runs/checkpoints, four held-out test summaries, evaluation visualizations, robot-camera captures, workflow snapshots, and runtime logs. This is private primary-source evidence and does not itself grant public-disclosure permission.
- Public Untangle prototype: `https://alinaaaw.github.io/untangle-demo/` — interactive evidence of the current Present Moment reflection flow, including concern entry, time sorting, emotion/body prompts, agency branching, action entry, release choices, and session closure.
- `TODO.md` wellbeing-project planning record and Wenrui's direct clarification that the interactive prototype exists and professor / teaching-staff feedback is currently being collected.


# 16. Consolidated Project-Readiness Matrix

This section records what is currently strong enough for direct website extraction versus what still requires confirmation or additional artifacts.

| Project / Experience | Origin & motivation | Process / reasoning | Implementation evidence | Results / findings | References | Physical / digital artifact | Major open items |
|---|---|---|---|---|---|---|---|
| EMG Monitoring Device | **Strong** — personal motivation, exercise-feedback problem, EMG vs angular-motion decision | **Strong** — candidate sensing methods, hardware iteration, MVC calibration concept, current adaptive-calibration idea | **Strong** — final `.ino`, `EMGFilters.cpp`, CAD STEP, reported Bluetooth/mobile integration | **Moderate** — current output is session-level proportions; no formal validation metrics yet | **Strong enough for contextual reference layer**; original project references can be expanded if exact sources are recovered | **Strong** — STEP + CAD screenshots + firmware | Exact hardware architecture, wireless protocol details, mobile UI, classification code details, validation protocol, quantitative performance |
| Course Assignment | **Strong** — observed inefficient optional-course assignment | **Very strong** — four objectives, cross-disciplinary research, algorithm selection, V1/V2 refinement | **Very strong** — Python source + decomposition + scoring | **Strong historical results** — 1,000 simulations; reported 70% top-2 / 92% top-3; confirmed class-wide scheduling deployment; runtime claim needs reconciliation | **Very strong** — original 7-reference list | **Strong** — code + presentation deck source text; scheduler artifacts not yet supplied | Exact benchmark defining runtime improvement; formal fairness definition; presentation/deck and scheduler artifact recovery |
| Quality of Life in Shanghai | **Strong** — older neighborhoods and quality-of-life concerns | **Strong** — mixed-methods + interdisciplinary framing + intervention design | **Strong** — HTML/CSS/JS | **Moderate** — survey and publicity findings; no map user testing | **Moderate** — contextual urban-QoL references | **Strong** — website code; presentation content; poster/project outputs described | Exact questionnaire/interview dataset, research methodology details, map screenshots, formal study conclusions |
| Social Futures Lab | **Moderate/Strong** — research context and ethical-case study established | **Moderate** — current hypothesis/ongoing questions partially known | **Strong for data transformation** — pandas code | **Strong for one result** — no apparent relationship between principle count and agreement; relevance/similarity results ongoing | **Not yet documented as a project-specific reference set** | **Strong digital evidence** — analysis script | Exact survey design, sample size, vector scheme provenance, full R output, broader findings |
| Thermo Fisher Internship | **Strong for robotics context; moderate for other workstreams** — automated laboratory tube handling and the remaining project contexts are clear | **Very strong for robotics** — dataset/model iteration, staged perception-to-action workflow, target reacquisition, physical calibration, reliability and safety reasoning; **strong at role level** for testing, workflow reconstruction, and onboarding | **Very strong private robotics evidence** — six principal utilities, three datasets/checkpoints, test outputs, logs, and real-hardware snapshots; public use remains disclosure-limited | **Strong detector results** — latest four-class model: 0.977 precision, 0.974 recall, 0.926 mAP50–95 on 15 held-out images; **approximately 98% author-reported overall workflow success** during real-hardware testing; residual camera/hardware fault cause unresolved; other internship workstreams are not numerically quantified | **Context references plus local primary artifacts; employer materials require disclosure review** | **Very strong private robotics artifact set**; Miro workflow artifact; redacted public assets still need approval | Logged trial count and success definition, per-stage/cycle-time metrics, root cause of intermittent camera/hardware failures, controlled latency/robustness test, exact public hardware naming, defect examples, and approved/redacted plots or screenshots |
| Untangle / Present Moment | **Moderate/Strong** — general wellbeing and reflection goal established; exact first target user still open | **Strong for current prototype logic** — worry externalization, time sorting, emotional labeling, agency checks, action/release branching | **Strong prototype evidence** — working public interactive demo; final stack and repository not documented | **Early-stage** — prototype behavior is confirmed and feedback is in progress; no usability or wellbeing outcome is established | **Not yet documented** — `EDUC 215` and independent reading are reported but exact sources remain open | **Strong current digital artifact** — public interactive prototype | Final name, start date, target user/use context, exact source foundation, stack/repository, feedback records, data behavior, accessibility, safety review, and usability testing |

## 16.1 Website-writing evidence policy

For future agents, the following distinction should be preserved:

**Can be stated directly:** facts established by the resume, source code, presentation content supplied by Wenrui, and other artifacts.

**Can be stated with cautious framing:** technical interpretations that follow directly from the implementation, such as treating the EMG session distribution as a sample-count approximation of time distribution under stable sampling.

**Should be labeled as proposed / future work:** adaptive MVC recalibration, intelligent exercise interpretation, personalized recommendations, logged replication of the reported 98% robot-workflow success rate, root-cause investigation of intermittent camera/hardware failures, controlled deployment-robustness testing, unfinished mobile-interface development, Untangle feedback-driven revisions, usability testing, and safety/privacy review.

**Should not be invented:** missing datasets, user-testing outcomes, unrecorded accuracy numbers, proprietary implementation details, exact publication status of ongoing research, unconfirmed authorship, Untangle wellbeing outcomes, or faculty / UW endorsement.

## 16.2 Recommended per-project extraction schema for downstream website agents

Each individual project page should be extractable into the following sections without borrowing facts from another project:

1. **Overview**
2. **Problem / Motivation**
3. **Goals / Design Criteria**
4. **Research & References**
5. **Ideation / Alternatives Considered**
6. **System / Algorithm Design**
7. **Implementation**
8. **Iteration / Version History**
9. **Results / Findings**
10. **Limitations / What Was Not Completed**
11. **Future Improvements**
12. **Artifacts / Evidence**
13. **My Specific Contribution**
14. **Technical Stack**
15. **Disclosure / Publication Boundary**

The exact sections should vary when appropriate. A research role, for example, should emphasize **question → data → method → result → ongoing work**, while a hardware project should emphasize **problem → design alternatives → physical architecture → firmware → testing → artifact**.

## 16.3 Global unresolved items

The remaining work is now primarily verification and artifact collection rather than reconstructing project motivations from scratch:

- recover / confirm the exact course-assignment runtime benchmark and wording;
- document the reported approximately 98% robot-workflow success rate with attempted/successful cycle counts, a success definition, handling time, and failure-stage categories;
- isolate the root cause of intermittent camera/hardware failures if possible;
- recover additional EMG hardware/wireless/mobile details and validation data;
- recover Social Futures Lab sample size, exact survey structure, and complete statistical output if publishable;
- recover Quality of Life in Shanghai screenshots / poster imagery / questionnaire details if available;
- confirm the Untangle project name, target user/use context, source foundation, technology stack, data behavior, feedback records, and usability/safety plan;
- perform disclosure review for Thermo Fisher material before any public website publication.

# Appendix A.1 Clarified measurement and interpretation logic

## Appendix A.1.1 Author clarification — authoritative project intent
Wenrui clarified that the project is intended to infer **muscle exertion level and muscle tension/activation state from EMG signals**, using an individual maximum-effort contraction as the reference point. The user is asked to contract the target muscle with maximum voluntary effort so that the resulting EMG magnitude establishes a personal maximum reference. Exercise measurements are then interpreted relative to that reference.

The project therefore does not primarily aim to classify an exercise into a simple movement label. Its intended analytical question is closer to:

> **During a training session, how much of the session did the target muscle spend at different relative levels of activation/exertion?**

## Appendix A.1.2 MVC-based normalization concept
The conceptual reference is:

**Maximum voluntary contraction / maximal voluntary effort → establish an individual reference → collect EMG during exercise → compare exercise signal magnitude to the reference → assign the observation to a relative activation/exertion range.**

The appropriate scientific wording for the website should be **relative muscle activation / relative exertion inferred from normalized EMG**, rather than claiming that the system directly measures mechanical muscle force.

A representative normalization expression is:

`relative EMG (%) = exercise EMG amplitude / MVC-reference EMG amplitude × 100`

The exact amplitude feature used in the implementation (e.g., instantaneous amplitude, RMS, integrated EMG, envelope, or another statistic) has **not yet been supplied and must not be invented**.

## Appendix A.1.3 Session-level aggregation metric
Wenrui clarified that the current analytical idea is based on **time spent in each relative-activation interval**.

For each relative EMG/exertion interval, the system would accumulate the total amount of time for which the signal falls within that interval and divide it by the total valid exercise duration:

`time share of interval (%) = duration observed in interval / total valid exercise duration × 100`

This produces a distribution such as:

- percentage of the training session spent at a lower relative-activation range;
- percentage of the session spent at a moderate range;
- percentage of the session spent at a higher range.

This metric should be described carefully. It means **“what percentage of the training session was spent within a given relative-activation range,”** not **“what percentage of physical force the muscle produced.”**

The distinction is important because normalized sEMG is a physiological activation indicator and is not a direct mechanical-force measurement.

## Appendix A.1.4 Why this metric matters for the original problem
This approach shifts the system from showing an uninterpreted EMG waveform toward producing a **training-session summary**. Instead of requiring the user to inspect a continuous noisy signal, the future application could communicate a compact description of the muscle's activation distribution over time.

The intended decision-support logic is therefore:

**Calibrate individual maximum → monitor exercise EMG → normalize relative to calibration → discretize/aggregate activation over time → summarize session → identify whether target-muscle recruitment matches training intent → adjust training technique/intensity/program as appropriate.**

## Appendix A.1.5 Current implementation boundary
The uploaded `EMGFilters.cpp` provides the **signal-conditioning layer** only. It contains the notch, low-pass, and high-pass filtering implementation, but it does not contain the higher-level MVC normalization, interval assignment, or session-duration aggregation described above. Those parts of the system should therefore be treated as **project-design information supplied by Wenrui**, not as functionality independently verified from the currently uploaded C++ artifact.

The resume separately states that the project includes signal-classification pipelines on ESP32 microcontrollers and mobile-app visualization, but the implementation details for those stages are not present in the current source upload. [Resume: Project description]

## Appendix A.1.6 Current software maturity statement
Wenrui confirmed that the physical hardware has been assembled and is operational, while the software, data-analysis, and user-interface layers remain incomplete. The project therefore should not be presented as a finished automated coaching platform. A more accurate progression is:

**operational wearable hardware + EMG acquisition + embedded filtering/processing + initial quantitative interpretation → software-interface development + user testing + future mobile analytics and more intelligent analysis.**

# Appendix A.2 CAD / enclosure design observations from supplied screenshots

Two newly supplied screenshots provide visual evidence of the mechanical design process in addition to the STEP artifact.

## Appendix A.2.1 Exterior form
The exterior model is a compact rounded enclosure with a deliberately softened perimeter rather than a simple rectangular box. The upper and lower shell surfaces appear to be shaped to produce a smoother physical form, with rounded transitions around the perimeter.

Visible exterior details include a separate main body and lid, as well as openings reserved for the power switch and charging port. These access points allow the device to be operated and recharged while the enclosure remains assembled.

## Appendix A.2.2 Interior architecture
The sectional/interior view shows a multi-level internal structure rather than an empty shell. Visible features include:
- internal mounting walls / supports;
- a raised central mounting platform;
- multiple circular mounting holes or standoff locations;
- side/internal structural members;
- compact reserved spaces for the ESP32 boards, battery, and related electronics;
- a layered arrangement that separates the enclosure shell from the internal mounting structure.

These observations support a portfolio claim that the project involved **physical packaging and internal component organization**, not merely an external cosmetic CAD model.

## Appendix A.2.3 Portfolio artifact recommendation
The two screenshots should be retained as project artifacts alongside the original STEP file. A useful website presentation would pair:

**Hero image:** exterior enclosure render/screenshot.

**Engineering detail image:** sectional interior view showing the internal mounting architecture.

**Downloadable artifact:** the STEP model, subject to confirming that the file contains no sensitive or proprietary information.

The screenshots are visual evidence of the design state and should be labeled as **CAD prototype / enclosure design**, not as proof of a manufactured final enclosure unless a physical prototype photograph is later supplied.

# Appendix A.3 Research foundation for the measurement concept

## Appendix A.3.1 External research direction
The project's MVC-relative interpretation can be contextualized with established sEMG literature on normalization and muscle activation. The website should distinguish this external scientific background from Wenrui's own implementation.

Relevant research themes include:
- normalization of EMG amplitude against maximal voluntary contraction/reference contractions;
- interpretation of normalized EMG as a measure of relative muscle activation;
- limitations of treating EMG amplitude as a direct proxy for mechanical force;
- effects of electrode placement, muscle length, contraction velocity, fatigue, and dynamic movement on the EMG–force relationship;
- the use of amplitude/time-domain features such as RMS or integrated EMG for characterizing muscle activity.

These references should be presented as **research foundation / reference material**, not as evidence that Wenrui necessarily followed a specific paper unless she confirms that she did.

# Appendix A.4 Future software architecture implied by the clarified concept

A future version of the system can be conceptually separated into the following modules:

1. **Calibration module** — collect maximal voluntary contraction/reference trials for each monitored muscle.
2. **Signal acquisition module** — receive synchronized EMG streams from the connected devices.
3. **Signal-conditioning module** — perform filtering and signal-quality checks.
4. **Normalization module** — transform exercise EMG into a user-specific relative reference scale.
5. **Interval classification module** — map normalized activity into configurable exertion bands.
6. **Temporal aggregation module** — accumulate duration and compute the percentage of valid session time spent in each band.
7. **Session analytics module** — summarize activation distributions across sets, repetitions, exercises, or sessions.
8. **Feedback module** — surface interpretable findings that may help the user adjust technique or intensity.
9. **Longitudinal analysis module** — compare activation patterns across training sessions over time.

Only the portions already evidenced by the supplied sources should be described as implemented; the remainder should be presented as the intended or future architecture.

# Appendix A.5 Stronger project narrative for the final website

A future polished project page should emphasize the following sequence:

> **The problem was not simply to record EMG, but to make muscle recruitment observable during exercise.** The project began from the observation that the muscle a person intends to train is not necessarily the muscle they are actually recruiting at the desired level. The system therefore combines custom mechanical design, multi-device EMG acquisition, embedded signal processing, and application-level visualization to quantify muscle activity during training. The intended analytical framework uses an individual's maximum voluntary contraction as a reference, normalizes exercise EMG against that reference, and summarizes how much of a training session is spent within different relative activation ranges. The longer-term goal is to turn these measurements into actionable feedback for adjusting exercise technique and training intensity.

This is a **drafting candidate**, not a verbatim user statement.
