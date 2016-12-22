<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class skill_images
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=1, nullable=false)
     */
    private $skill_initial;

    /**
     * @ORM\OneToMany(targetEntity="Entities\skill_ref", mappedBy="skillImages")
     */
    private $skillRef;
}