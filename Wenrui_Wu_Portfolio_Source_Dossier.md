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
- the final form factor or enclosure dimensions;
- whether the system is intended for sports, rehabilitation, ergonomics, exercise science, accessibility, or another domain;
- quantitative classification accuracy or latency;
- battery life;
- final hardware cost;
- whether the device is wearable, handheld, or mounted.

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
- A supplied STEP CAD model (`整合.step`) representing one solid mechanical body; this can serve as a portfolio artifact showing concrete mechanical design work.
- Multiple Bluetooth-connected EMG devices.
- ESP32-based embedded hardware.
- Mobile-app visualization interface.

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
- used 3D printing to produce prototypes and test multiple physical versions;
- iterated toward a smaller enclosure capable of containing the required electronics.

The CAD screenshots and STEP artifact should therefore be presented as evidence of **iterative mechanical prototyping**, not merely as a static CAD exercise.

## 1.13 Current project maturity

The project has progressed beyond concept ideation into a working embedded prototype with a quantitative session-analysis mechanism. The current completed layer is:

**Physical enclosure + sensing hardware → embedded signal processing → individual calibration → fixed-band classification → training-session percentage output**

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
8. What is the current physical prototype state?
9. What are the most important quantitative results so far?
10. What was the biggest engineering bottleneck?

---

# 2. Project: Automatic and Satisfactory Course Assignment

## 2.1 Canonical project record

**Project title in source:** Automatic and Satisfactory Course Assignment

**Timeline:** January 2024 – March 2025

**Technologies listed on resume:** Python, NumPy

**Resume-supported outcomes:**
- Researched and evaluated assignment algorithms based on satisfaction and allocation efficiency.
- Designed and implemented allocation methods using the Simultaneous Eating and Birkhoff Decomposition algorithms to optimize overall satisfaction.
- Incorporated feedback from 30+ professors and peers to optimize algorithm design, improving runtime by 200+%.
- Extended the algorithm to implement a parent–teacher meeting scheduler.

## 2.2 Central problem

The project addresses an allocation problem: assigning students to capacity-constrained courses while attempting to optimize satisfaction rather than merely filling available seats.

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

A future case-study page could distinguish:
- **who gave feedback:** professors vs. peers;
- **what they evaluated:** satisfaction, fairness, usability, runtime, or explainability;
- **what changed:** algorithm logic, data structures, tie-breaking, interface, or evaluation metric;
- **how the change was measured:** quantitative benchmark or qualitative feedback.

Those details are not available in the current files.

## 2.8 Extended application: parent–teacher meeting scheduler

The resume states that the course-assignment algorithm was extended into a parent–teacher meeting scheduler. [Resume: Projects]

The current upload does not contain the scheduler implementation, interface, scheduling constraints, or output examples. Therefore this should be a separate “extension” subsection, not merged with the course-allocation technical details until the actual implementation is supplied.

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

The project was discussed with college students and professors during the National Round of China Thinks Big, where the algorithm was reviewed for improvement and further application.

The resulting mechanism was later adapted to a **parent–teacher meeting time-slot allocation problem**, with the scoring system modified to reflect the requirements of that application. The resume reports that this adaptation significantly reduced teacher workload and increased overall parent satisfaction. [Resume: Projects]

The public portfolio should make clear that this is an **extension of the allocation framework to a second real-world scheduling problem**, not a separate unrelated project.

## 2.18 Open questions for Wenrui

1. What was the original real-world motivation for building the course-assignment algorithm?
2. What exactly did “satisfactory” mean from the user perspective?
3. Were student preferences simulated only, or did you test on real/anonymized data?
4. Which part of the implementation is specifically your own interpretation of Simultaneous Eating / Probabilistic Serial?
5. How exactly did Birkhoff decomposition enter the production of a final random assignment?
6. What did the 30+ professors and peers actually suggest?
7. What optimization produced the reported runtime improvement?
8. What were the baseline and optimized benchmark numbers?
9. How was the parent–teacher scheduler connected to the original algorithm?
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

The resume establishes:
- YOLO26 is used for object detection;
- ROS2 is part of the robot-control stack;
- the end use case involves repetitive laboratory sample handling.

The wording does not specify the robot brand/model, camera model, detection classes, coordinate transformation method, motion-planning layer, or safety architecture. Those details should be added only if Wenrui can disclose them.

External context: Ultralytics currently documents YOLO26 as an end-to-end detection architecture with an inference path designed to avoid non-maximum suppression and to support edge deployment. citeturn577732search0turn577732search4

The use of YOLO26 in the portfolio should remain scoped to the user's integration work rather than implying ownership of the underlying model architecture.

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

These are supported synthesis statements, but exact technical performance claims require additional evidence.

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

### Your scope
Wenrui's contribution covered the end-to-end perception-to-action integration:

**Image acquisition → YOLO detection → positional information handling → ROS2 interface → robot-arm action → tube grasping / placement.**

Some low-level robot movement functionality was already encapsulated by the robot environment / API. The portfolio should describe Wenrui's work as **integration and control-layer engineering using the available robot interface**, rather than claiming ownership of the underlying proprietary motion-control implementation.

### Model retraining rationale
The model was retrained with an expanded object taxonomy covering:
- tube;
- tube cap;
- tube rack;
- empty rack hole / opening.

Training images were also collected directly from the robot's onboard camera so that the training data better reflected the actual deployment viewpoint and operating environment.

### Result status
Wenrui observed improvement during real robot operation after retraining, but no formal detection or task-success metric was recorded at the time.

Potential retrospective metrics include:
- precision / recall / mAP for each class;
- successful tube-grasp rate;
- successful tube-placement rate;
- failure rate;
- average handling time per tube;
- performance under different operating conditions.

These metrics are **future validation opportunities**, not current quantified outcomes.

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

## 5.13 Open questions for Wenrui

1. What part of the YOLO26 + ROS2 integration did you personally implement?
2. What object(s) were detected?
3. How was the image-space detection connected to robot-arm coordinates?
4. What robot and camera hardware can be named publicly?
5. What was the main technical challenge?
6. What measurable outcome can be disclosed?
7. For 3500Dx testing, what kinds of localization/workflow defects did you catch?
8. For Qantis, what type of workflow model or diagram did you produce?
9. What onboarding materials did you create?
10. Which parts of the internship are public-safe for a portfolio?

---

# 6. Cross-Project Evidence Map

## 6.1 Hardware / physical computing
Strongest evidence:
- EMG monitoring device;
- Fusion and AutoCAD;
- ESP32;
- Arduino/C++;
- Bluetooth-connected sensing.

## 6.2 Algorithms / mathematical modeling
Strongest evidence:
- Simultaneous Eating / probabilistic allocation;
- Birkhoff decomposition;
- capacity-constrained assignment;
- quantitative satisfaction scoring;
- randomized simulation.

## 6.3 Data / research
Strongest evidence:
- Social Futures Lab survey analysis;
- pandas and normalized vectors;
- mixed-methods Shanghai QoL study.

## 6.4 Web / interaction
Strongest evidence:
- interactive Shanghai map;
- JavaScript state management;
- category and walking-time filters;
- detail-panel interaction.

## 6.5 Applied engineering
Strongest evidence:
- YOLO26 + ROS2 laboratory automation;
- black-box testing of scientific software;
- workflow reverse engineering;
- intern onboarding.

## 6.6 Human-centered engineering
Cross-cutting examples:
- usability/accessibility refinement in the EMG project;
- satisfaction as a metric in course assignment;
- community insights and resident-facing mapping in Shanghai;
- localization testing and UI workflow clarification in the internship.

---

# 7. Reference Material Library

The following references are suitable for a portfolio research/reference section. They are **contextual references found during preparation**, not verified evidence of what Wenrui personally read.

## 7.1 Course allocation / fair assignment

1. Bogomolnaia, A. & Moulin, H. (2001). “A New Solution to the Random Assignment Problem.” *Journal of Economic Theory*, 100(2), 295–328. The paper introduces and characterizes the Probabilistic Serial mechanism and discusses ordinal efficiency, envy-freeness, and the contrast with Random Priority. citeturn515935search0

2. Zhan, P. (2023). “Simultaneous eating algorithm and greedy algorithm in assignment problems.” *Journal of Combinatorial Optimization*, 45, 137. The paper provides a modern treatment of Simultaneous Eating and discusses its relationship with Probabilistic Serial. citeturn635696search0

3. Birkhoff–von Neumann theorem references: the theorem characterizes doubly stochastic matrices as convex combinations of permutation matrices. citeturn515935search4turn515935search24

4. Bichler et al. / course allocation literature: randomized scheduling mechanisms have been studied specifically for fair and efficient course-seat assignment, including Probabilistic Serial. citeturn635696search1

## 7.2 EMG / signal processing

1. Published work describing OYMotion EMG filtering: a practical example uses anti-hum notch, low-pass, and high-pass filtering around 50 Hz, 150 Hz, and 20 Hz respectively. citeturn897629search26

2. Recent EMG-processing review material discusses typical 20–500 Hz band-pass ranges, Butterworth filtering, and 50/60 Hz notch filtering while noting the trade-off between interference removal and signal preservation. citeturn897629search7turn897629search2

## 7.3 Urban quality of life

1. WHO, *Integrating health in urban and territorial planning* — connects urban planning with access to transport, food, education, healthcare, environmental quality, and well-being. citeturn420922search7

2. OECD, *Cities in the World* — provides comparative urban well-being framing and highlights quality-of-life dimensions across cities. citeturn420922search1turn420922search36

3. UN-Habitat, *Quality of Life in Cities: Insights from the Quality of Life Initiative Pilot Phase* — a multidimensional framework incorporating both objective indicators and residents' perceptions. citeturn420922search11

4. UN-Habitat, *Quality of Life Initiative Implementation Guidelines* — a practical framework for assessing and improving urban well-being. citeturn420922search9

## 7.4 Computer vision / robotics

1. Ultralytics YOLO26 documentation — useful for contextualizing the object-detection component and discussing end-to-end detection and edge deployment. citeturn577732search0turn577732search4

2. Thermo Fisher 3500 Dx documentation — useful for explaining the scientific-instrument context of the software testing work. citeturn577732search7turn577732search9

---

# 8. Artifact Inventory

## 8.1 Provided digital artifacts

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

## 8.2 Missing high-value artifacts

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
- internship-safe diagrams or architecture sketches.

---

# 9. Version History / Evolution Tracking Template

Because the supplied files are snapshots rather than a full repository history, actual version chronology cannot currently be reconstructed.

For each project, future agents should maintain the following record:

## 9.1 Version record
- **Version/date:**
- **Problem state:**
- **Implementation state:**
- **Key change:**
- **Reason for change:**
- **Evidence:** commit / screenshot / benchmark / report
- **Observed improvement:**
- **New limitation:**
- **Next planned change:**

## 9.2 Especially relevant for the course-assignment project
Track transitions from:
1. random preference simulation;
2. fractional probability allocation;
3. deterministic allocation;
4. decomposition;
5. scoring/evaluation;
6. runtime optimization;
7. real scheduling extension.

## 9.3 Especially relevant for the EMG project
Track transitions from:
1. hardware concept;
2. first physical prototype;
3. single-channel acquisition;
4. multi-device acquisition;
5. filtering;
6. ESP32 classification;
7. Bluetooth/mobile integration;
8. interface refinement.

## 9.4 Especially relevant for the Shanghai project
Track transitions from:
1. research question;
2. questionnaire/interview collection;
3. insight extraction;
4. map information architecture;
5. category filtering;
6. walking-time filtering;
7. detail interactions;
8. public/community deployment.

---

# 10. What Can Safely Be Published Now vs. What Needs Confirmation

## Safe / strongly supported now
- Project names and dates from the resume.
- Technologies explicitly listed in the resume.
- High-level responsibilities.
- The existence of the course-allocation algorithm components visible in source code.
- The Shanghai map's category and time-filter interaction.
- The OYMotion filter implementation details visible in the uploaded C++ source.
- The stated internship responsibilities at a high level.
- The research assistant's stated analysis tasks.

## Safe with careful wording
- The interpretation that the course project operationalizes a probabilistic/fractional allocation mechanism.
- The interpretation that the Shanghai site is a civic-tech / human-centered artifact.
- The interpretation that the EMG project is a full-stack physical computing system.
- The interpretation that the internship demonstrates cross-functional engineering across CV, robotics, testing, and UX communication.

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

---

# 11. Suggested Website Information Architecture

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

# 12. Agent Instructions for Future Rewriting

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

---

# 13. Highest-Priority Questions for the Next Revision

To keep the information-gathering process one question at a time, the single highest-value next question is:

**What is the exact problem statement and intended user/use case of your “Monitoring Device for Muscle Usage & Behavior” project, and what do you ultimately want the device to help a person understand or accomplish?**

Once that is answered, the next revision can turn the EMG section from a source-grounded technical summary into a much richer design/ideation narrative without guessing at your motivation.

---

# 14. Source Citations Used in This Dossier

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


# 15. Consolidated Project-Readiness Matrix

This section records what is currently strong enough for direct website extraction versus what still requires confirmation or additional artifacts.

| Project / Experience | Origin & motivation | Process / reasoning | Implementation evidence | Results / findings | References | Physical / digital artifact | Major open items |
|---|---|---|---|---|---|---|---|
| EMG Monitoring Device | **Strong** — personal motivation, exercise-feedback problem, EMG vs angular-motion decision | **Strong** — candidate sensing methods, hardware iteration, MVC calibration concept, current adaptive-calibration idea | **Strong** — final `.ino`, `EMGFilters.cpp`, CAD STEP, reported Bluetooth/mobile integration | **Moderate** — current output is session-level proportions; no formal validation metrics yet | **Strong enough for contextual reference layer**; original project references can be expanded if exact sources are recovered | **Strong** — STEP + CAD screenshots + firmware | Exact hardware architecture, wireless protocol details, mobile UI, classification code details, validation protocol, quantitative performance |
| Course Assignment | **Strong** — observed inefficient optional-course assignment | **Very strong** — four objectives, cross-disciplinary research, algorithm selection, V1/V2 refinement | **Very strong** — Python source + decomposition + scoring | **Strong historical results** — 1,000 simulations; reported 70% top-2 / 92% top-3; runtime claim needs reconciliation | **Very strong** — original 7-reference list | **Strong** — code + presentation deck source text | Exact benchmark defining runtime improvement; formal fairness definition; presentation/deck artifact recovery |
| Quality of Life in Shanghai | **Strong** — older neighborhoods and quality-of-life concerns | **Strong** — mixed-methods + interdisciplinary framing + intervention design | **Strong** — HTML/CSS/JS | **Moderate** — survey and publicity findings; no map user testing | **Moderate** — contextual urban-QoL references | **Strong** — website code; presentation content; poster/project outputs described | Exact questionnaire/interview dataset, research methodology details, map screenshots, formal study conclusions |
| Social Futures Lab | **Moderate/Strong** — research context and ethical-case study established | **Moderate** — current hypothesis/ongoing questions partially known | **Strong for data transformation** — pandas code | **Strong for one result** — no apparent relationship between principle count and agreement; relevance/similarity results ongoing | **Not yet documented as a project-specific reference set** | **Strong digital evidence** — analysis script | Exact survey design, sample size, vector scheme provenance, full R output, broader findings |
| Thermo Fisher Internship | **Moderate** — project contexts are clear | **Strong** — model adaptation, test-case interpretation, workflow reconstruction, onboarding | **Strong at role level; limited by proprietary constraints** | **Moderate** — qualitative improvement observed in robotics; testing/reverse-engineering outcomes not numerically quantified | **Context references only; employer materials require disclosure review** | **Moderate/strong** — Miro workflow artifact and potential safe technical diagrams | Public-safe metrics, robot/camera naming, quantitative detection/task results, defect examples, approved screenshots |

## 15.1 Website-writing evidence policy

For future agents, the following distinction should be preserved:

**Can be stated directly:** facts established by the resume, source code, presentation content supplied by Wenrui, and other artifacts.

**Can be stated with cautious framing:** technical interpretations that follow directly from the implementation, such as treating the EMG session distribution as a sample-count approximation of time distribution under stable sampling.

**Should be labeled as proposed / future work:** adaptive MVC recalibration, intelligent exercise interpretation, personalized recommendations, retrospective robotics benchmarking, and unfinished mobile-interface development.

**Should not be invented:** missing datasets, user-testing outcomes, unrecorded accuracy numbers, proprietary implementation details, exact publication status of ongoing research, or unconfirmed authorship.

## 15.2 Recommended per-project extraction schema for downstream website agents

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

## 15.3 Global unresolved items

The remaining work is now primarily verification and artifact collection rather than reconstructing project motivations from scratch:

- recover / confirm the exact course-assignment runtime benchmark and wording;
- recover quantitative robotics metrics if available;
- recover additional EMG hardware/wireless/mobile details and validation data;
- recover Social Futures Lab sample size, exact survey structure, and complete statistical output if publishable;
- recover Quality of Life in Shanghai screenshots / poster imagery / questionnaire details if available;
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
Wenrui explicitly described the more advanced software and intelligent analysis as **future work**. The project therefore currently should not be presented as a finished automated coaching platform. A more accurate progression is:

**hardware prototype + EMG acquisition + embedded filtering/processing + initial quantitative interpretation concept → future mobile analytics and more intelligent analysis.**

# Appendix A.2 CAD / enclosure design observations from supplied screenshots

Two newly supplied screenshots provide visual evidence of the mechanical design process in addition to the STEP artifact.

## Appendix A.2.1 Exterior form
The exterior model is a compact rounded enclosure with a deliberately softened perimeter rather than a simple rectangular box. The upper and lower shell surfaces appear to be shaped to produce a smoother physical form, with rounded transitions around the perimeter.

Visible exterior details include multiple fastening/opening features around the enclosure and a side-facing elongated opening/port area. The design therefore appears to consider both enclosure assembly and access to a physical interface/connector.

## Appendix A.2.2 Interior architecture
The sectional/interior view shows a multi-level internal structure rather than an empty shell. Visible features include:
- internal mounting walls / supports;
- a raised central mounting platform;
- multiple circular mounting holes or standoff locations;
- side/internal structural members;
- reserved spaces for internal electronics/components;
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
