The emoji analyzer should act like a configurable rule engine. The architecture
will be used as a basis for the way similar programs may be built and for this
reason it will at first include pieces that will later be moved out to other
packages and repositories.

The emoji analyzer will have these components:
- **models**: the behavior of the program is mostly defined by data
- **core**: this is the actual emoji 